using System.Security.Claims;
using Models;
using MongoDB.Driver;

namespace Host.Endpoints;

public static class StudentEndpoints
{
    public static IEndpointRouteBuilder MapStudentEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/students").RequireAuthorization();

        // GET /api/students
        group.MapGet("/", async (ClaimsPrincipal user, IMongoDatabase db) =>
        {
            var teacherId = user.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? user.FindFirstValue("sub");
            if (teacherId is null) return Results.Unauthorized();

            var students = await db.GetCollection<Student>("students")
                .Find(s => s.TeacherId == teacherId)
                .ToListAsync();
            return Results.Ok(students);
        });

        // GET /api/students/{id}
        group.MapGet("/{id}", async (string id, ClaimsPrincipal user, IMongoDatabase db) =>
        {
            var teacherId = user.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? user.FindFirstValue("sub");
            if (teacherId is null) return Results.Unauthorized();

            var student = await db.GetCollection<Student>("students")
                .Find(s => s.Id == id && s.TeacherId == teacherId)
                .FirstOrDefaultAsync();
            return student is null ? Results.NotFound() : Results.Ok(student);
        });

        // POST /api/students
        group.MapPost("/", async (Student student, ClaimsPrincipal user, IMongoDatabase db) =>
        {
            var teacherId = user.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? user.FindFirstValue("sub");
            if (teacherId is null) return Results.Unauthorized();

            student.TeacherId = teacherId;
            await db.GetCollection<Student>("students").InsertOneAsync(student);
            return Results.Created($"/api/students/{student.Id}", student);
        });

        // PUT /api/students/{id}
        group.MapPut("/{id}", async (string id, Student updated, ClaimsPrincipal user, IMongoDatabase db) =>
        {
            var teacherId = user.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? user.FindFirstValue("sub");
            if (teacherId is null) return Results.Unauthorized();

            updated.Id = id;
            updated.TeacherId = teacherId;
            var result = await db.GetCollection<Student>("students")
                .ReplaceOneAsync(s => s.Id == id && s.TeacherId == teacherId, updated);
            return result.MatchedCount == 0 ? Results.NotFound() : Results.Ok(updated);
        });

        // GET /api/students/{id}/lessons
        group.MapGet("/{id}/lessons", async (string id, ClaimsPrincipal user, IMongoDatabase db) =>
        {
            var teacherId = user.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? user.FindFirstValue("sub");
            if (teacherId is null) return Results.Unauthorized();

            // Confirm the student belongs to this teacher
            var student = await db.GetCollection<Student>("students")
                .Find(s => s.Id == id && s.TeacherId == teacherId)
                .FirstOrDefaultAsync();
            if (student is null) return Results.NotFound();

            var lessons = await db.GetCollection<Lesson>("lessons")
                .Find(l => l.StudentId == id && l.TeacherId == teacherId)
                .SortByDescending(l => l.Date)
                .ToListAsync();

            return Results.Ok(lessons);
        });

        // DELETE /api/students/{id}
        group.MapDelete("/{id}", async (string id, ClaimsPrincipal user, IMongoDatabase db) =>
        {
            var teacherId = user.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? user.FindFirstValue("sub");
            if (teacherId is null) return Results.Unauthorized();

            var result = await db.GetCollection<Student>("students")
                .DeleteOneAsync(s => s.Id == id && s.TeacherId == teacherId);
            return result.DeletedCount == 0 ? Results.NotFound() : Results.NoContent();
        });

        return app;
    }
}
