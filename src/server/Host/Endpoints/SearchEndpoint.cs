using System.Security.Claims;
using MongoDB.Driver;
using Models;

namespace Host.Endpoints;

public static class SearchEndpoints
{
    public static IEndpointRouteBuilder MapSearchEndpoints(this IEndpointRouteBuilder app)
    {
        // GET /api/search?q=...
        app.MapGet("api/search", async (string q, ClaimsPrincipal user, IMongoDatabase db) =>
        {
            if (string.IsNullOrWhiteSpace(q))
                return Results.BadRequest("Query parameter 'q' is required.");

            var teacherId = user.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? user.FindFirstValue("sub");
            if (teacherId is null) return Results.Unauthorized();

            var lower = q.ToLowerInvariant();
            var results = new List<SearchResult>();

            // Students
            var students = await db.GetCollection<Student>("students")
                .Find(s => s.TeacherId == teacherId && s.Name.ToLower().Contains(lower))
                .ToListAsync();
            results.AddRange(students.Select(s => new SearchResult
            {
                Id = s.Id ?? "",
                Title = s.Name,
                Type = "student"
            }));

            // Songs
            var songs = await db.GetCollection<Song>("songs")
                .Find(s => s.Title.ToLower().Contains(lower) || s.Artist.ToLower().Contains(lower))
                .ToListAsync();
            results.AddRange(songs.Select(s => new SearchResult
            {
                Id = s.Id ?? "",
                Title = $"{s.Title} — {s.Artist}",
                Type = "song",
                SpotifyTrackId = s.SpotifyTrackId
            }));

            // Tags
            var tags = await db.GetCollection<Models.Tag>("tags")
                .Find(t => t.Name.ToLower().Contains(lower))
                .ToListAsync();
            results.AddRange(tags.Select(t => new SearchResult
            {
                Id = t.Id ?? "",
                Title = $"#{t.Name}",
                Type = "tag"
            }));

            // Documents
            var documents = await db.GetCollection<Document>("documents")
                .Find(d => d.TeacherId == teacherId && d.Title.ToLower().Contains(lower))
                .ToListAsync();
            results.AddRange(documents.Select(d => new SearchResult
            {
                Id = d.Id ?? "",
                Title = d.Title,
                Type = "document"
            }));

            // Lessons (match by instrument or notes)
            // var lessons = await db.GetCollection<Lesson>("lessons")
            //     .Find(l => l.TeacherId == teacherId &&
            //                (l.Instrument.ToLower().Contains(lower) || l.Notes.ToLower().Contains(lower)))
            //     .ToListAsync();
            // results.AddRange(lessons.Select(l => new SearchResult
            // {
            //     Id = l.Id ?? "",
            //     Title = $"{l.Date:MMM d, yyyy} — {l.Instrument}",
            //     Type = "lesson"
            // }));

            return Results.Ok(results);
        }).RequireAuthorization();

        return app;
    }
}