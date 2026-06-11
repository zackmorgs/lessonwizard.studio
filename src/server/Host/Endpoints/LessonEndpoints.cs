using Models;
using MongoDB.Driver;

namespace Host.Endpoints;

public static class LessonEndpoints
{
    public static IEndpointRouteBuilder MapLessonEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/lessons").RequireAuthorization();

        // GET /api/lessons
        group.MapGet("/", async (IMongoDatabase db) =>
        {
            var lessons = await db.GetCollection<Lesson>("lessons")
                .Find(_ => true)
                .ToListAsync();
            return Results.Ok(lessons);
        });

        // GET /api/lessons/{id}
        group.MapGet("/{id}", async (string id, IMongoDatabase db) =>
        {
            var lesson = await db.GetCollection<Lesson>("lessons")
                .Find(l => l.Id == id)
                .FirstOrDefaultAsync();
            return lesson is null ? Results.NotFound() : Results.Ok(lesson);
        });

        // POST /api/lessons
        group.MapPost("/", async (Lesson lesson, IMongoDatabase db) =>
        {
            await db.GetCollection<Lesson>("lessons").InsertOneAsync(lesson);
            return Results.Created($"/api/lessons/{lesson.Id}", lesson);
        });

        // PUT /api/lessons/{id}
        group.MapPut("/{id}", async (string id, Lesson updated, IMongoDatabase db) =>
        {
            updated.Id = id;
            var result = await db.GetCollection<Lesson>("lessons")
                .ReplaceOneAsync(l => l.Id == id, updated);
            return result.MatchedCount == 0 ? Results.NotFound() : Results.Ok(updated);
        });

        // DELETE /api/lessons/{id}
        group.MapDelete("/{id}", async (string id, IMongoDatabase db) =>
        {
            var result = await db.GetCollection<Lesson>("lessons")
                .DeleteOneAsync(l => l.Id == id);
            return result.DeletedCount == 0 ? Results.NotFound() : Results.NoContent();
        });

        return app;
    }
}
