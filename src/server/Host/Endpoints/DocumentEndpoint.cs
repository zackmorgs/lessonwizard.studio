using System.Security.Claims;
using Models;
using MongoDB.Driver;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using PdfDocument = QuestPDF.Fluent.Document;

namespace Host.Endpoints;

public static class DocumentEndpoint
{
    public static IEndpointRouteBuilder MapDocumentEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/documents").RequireAuthorization();

        // basic PDF upload for a song
        group.MapPost("/songs/upload/{songId}", async (string songId, IFormFile pdf, ClaimsPrincipal user, IMongoDatabase db, IWebHostEnvironment env) =>
        {
            var teacherId = user.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? user.FindFirstValue("sub");
            if (teacherId is null) return Results.Unauthorized();

            if (string.IsNullOrWhiteSpace(pdf.FileName))
                return Results.BadRequest("PDF file is required.");

            var document = new Models.Document
            {
                Title = Path.GetFileNameWithoutExtension(pdf.FileName),
                TeacherId = teacherId,
                PdfUrl = $"path/to/storage/{pdf.FileName}" // replace with actual file path or URL after saving the PDF
            };

            if (string.IsNullOrWhiteSpace(songId))
                return Results.BadRequest("Song ID is required.");

            var docsDir = Path.Combine(env.WebRootPath, "documents");

            if (!Directory.Exists(docsDir))
                Directory.CreateDirectory(docsDir);
            var pdfPath = Path.Combine(docsDir, pdf.FileName);

            using (var stream = new FileStream(pdfPath, FileMode.Create))
            {
                await pdf.CopyToAsync(stream);
            }

            document.PdfUrl = $"documents/{pdf.FileName}"; // update the PdfUrl to the actual file path relative to wwwroot
            document.SongId = songId;
            document.TeacherId = teacherId;
            // save uploaded pdf to a file storage or cloud storage


            await db.GetCollection<Models.Document>("documents").InsertOneAsync(document);

            // Link the document back to the song (only if songId is a valid ObjectId)
            if (MongoDB.Bson.ObjectId.TryParse(songId, out _))
            {
                var songUpdate = Builders<Song>.Update.Set(s => s.documentId, document.Id);
                await db.GetCollection<Song>("songs").UpdateOneAsync(s => s.Id == songId, songUpdate);
            }

            return Results.Ok(document);
        }).DisableAntiforgery();

        // GET /api/documents
        group.MapGet("/", async (ClaimsPrincipal user, IMongoDatabase db) =>
        {
            var teacherId = user.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? user.FindFirstValue("sub");
            if (teacherId is null) return Results.Unauthorized();

            var documents = await db.GetCollection<Models.Document>("documents")
                .Find(d => d.TeacherId == teacherId)
                .ToListAsync();
            return Results.Ok(documents);
        });

        // GET /api/documents/{id}
        group.MapGet("/{id}", async (string id, ClaimsPrincipal user, IMongoDatabase db) =>
        {
            var teacherId = user.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? user.FindFirstValue("sub");
            if (teacherId is null) return Results.Unauthorized();


            var document = await db.GetCollection<Models.Document>("documents")
                .Find(d => d.Id == id && d.TeacherId == teacherId)
                .FirstOrDefaultAsync();
            return document is null ? Results.NotFound() : Results.Ok(document);
        });

        // POST /api/documents/from-images
        // Accepts multipart/form-data: images[] (files), title, description, tagIds[]
        group.MapPost("/from-images", async (
            HttpRequest request,
            ClaimsPrincipal user,
            IMongoDatabase db,
            IWebHostEnvironment env) =>
        {
            var teacherId = user.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? user.FindFirstValue("sub");
            if (teacherId is null) return Results.Unauthorized();

            if (!request.HasFormContentType)
                return Results.BadRequest("Expected multipart/form-data.");

            var form = await request.ReadFormAsync();
            var title = form["title"].FirstOrDefault() ?? "Untitled Document";
            var description = form["description"].FirstOrDefault() ?? string.Empty;
            var tagIds = form["tagIds"].Where(t => !string.IsNullOrEmpty(t)).ToList();
            var imageFiles = form.Files.GetFiles("images");

            if (!imageFiles.Any())
                return Results.BadRequest("At least one image is required.");

            // Read all images into memory first so streams aren't disposed mid-PDF
            var imageData = new List<byte[]>();
            foreach (var file in imageFiles)
            {
                using var ms = new MemoryStream();
                await file.CopyToAsync(ms);
                imageData.Add(ms.ToArray());
            }

            // Build PDF — one image per page, fitted to A4
            QuestPDF.Settings.License = LicenseType.Community;
            var pdfBytes = PdfDocument.Create(container =>
            {
                foreach (var imgBytes in imageData)
                {
                    container.Page(page =>
                    {
                        page.Size(PageSizes.A4);
                        page.Margin(20);
                        page.Content()
                            .AlignCenter()
                            .AlignMiddle()
                            .Image(imgBytes)
                            .FitArea();
                    });
                }
            }).GeneratePdf();

            // Persist PDF file under wwwroot/documents/
            var docsDir = Path.Combine(env.WebRootPath, "documents");
            Directory.CreateDirectory(docsDir);
            var fileName = $"{Guid.NewGuid()}.pdf";
            var filePath = Path.Combine(docsDir, fileName);
            await File.WriteAllBytesAsync(filePath, pdfBytes);

            // Save Document record to MongoDB
            var doc = new Models.Document
            {
                TeacherId = teacherId,
                Title = title,
                Description = description,
                PdfUrl = $"/documents/{fileName}",
                TagIds = tagIds!
            };
            await db.GetCollection<Models.Document>("documents").InsertOneAsync(doc);

            return Results.Created($"/api/documents/{doc.Id}", doc);
        });

        // DELETE /api/documents/{id}
        group.MapDelete("/{id}", async (string id, ClaimsPrincipal user, IMongoDatabase db, IWebHostEnvironment env) =>
        {
            var teacherId = user.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? user.FindFirstValue("sub");
            if (teacherId is null) return Results.Unauthorized();

            var doc = await db.GetCollection<Models.Document>("documents")
                .FindOneAndDeleteAsync(d => d.Id == id && d.TeacherId == teacherId);
            if (doc is null) return Results.NotFound();

            // Remove the PDF file if present
            if (!string.IsNullOrEmpty(doc.PdfUrl))
            {
                var filePath = Path.Combine(env.WebRootPath, doc.PdfUrl.TrimStart('/'));
                if (File.Exists(filePath)) File.Delete(filePath);
            }

            // Clear the documentId back-reference on the linked song
            if (!string.IsNullOrEmpty(doc.SongId))
            {
                var songUpdate = Builders<Song>.Update.Set(s => s.documentId, string.Empty);
                await db.GetCollection<Song>("songs").UpdateOneAsync(s => s.Id == doc.SongId, songUpdate);
            }

            return Results.NoContent();
        });

        return app;
    }
}