using System.Security.Claims;
using Models;
using MongoDB.Driver;

namespace Host.Endpoints;

public static class SongEndpoints
{
    public static IEndpointRouteBuilder MapSongEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/songs").RequireAuthorization();

        // GET /api/songs
        group.MapGet("/", async (ClaimsPrincipal user, IMongoDatabase db) =>
        {
            var teacherId = user.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? user.FindFirstValue("sub");
            if (teacherId is null) return Results.Unauthorized();

            var songs = await db.GetCollection<Song>("songs")
                .Find(_ => true)
                .ToListAsync();
            return Results.Ok(songs);
        });

        // GET /api/songs/{id}
        group.MapGet("/{id}", async (string id, ClaimsPrincipal user, IMongoDatabase db) =>
        {
            var song = await db.GetCollection<Song>("songs")
                .Find(s => s.Id == id)
                .FirstOrDefaultAsync();
            return song is null ? Results.NotFound() : Results.Ok(song);
        });

        // POST /api/songs
        group.MapPost("/", async (Song song, IMongoDatabase db) =>
        {
            await db.GetCollection<Song>("songs").InsertOneAsync(song);
            return Results.Created($"/api/songs/{song.Id}", song);
        });

        // PUT /api/songs/{id}
        group.MapPut("/{id}", async (string id, Song updated, IMongoDatabase db) =>
        {
            updated.Id = id;
            var result = await db.GetCollection<Song>("songs")
                .ReplaceOneAsync(s => s.Id == id, updated);
            return result.MatchedCount == 0 ? Results.NotFound() : Results.Ok(updated);
        });

        // DELETE /api/songs/{id}
        group.MapDelete("/{id}", async (string id, IMongoDatabase db) =>
        {
            var result = await db.GetCollection<Song>("songs")
                .DeleteOneAsync(s => s.Id == id);
            return result.DeletedCount == 0 ? Results.NotFound() : Results.NoContent();
        });

        group.MapGet("/tag/{tag}/songs/", async (string tag, IMongoDatabase db) =>
        {
            var songs = await db.GetCollection<Song>("songs")
                .Find(s => s.TagIds != null && s.TagIds.Contains(tag))
                .ToListAsync();
            return Results.Ok(songs);
        });


        group.MapGet("/tag/{tag}/lessons/", async (string tag, IMongoDatabase db) =>
        {
            var lessons = await db.GetCollection<Models.Lesson>("lessons")
                .Find(s => s.TagIds != null && s.TagIds.Contains(tag))
                .ToListAsync();
            return Results.Ok(lessons);
        });


        group.MapGet("/student/{studentId}", async (string studentId, IMongoDatabase db) =>
        {
            var songs = await db.GetCollection<Models.Song>("songs")
                .Find(s => s.StudentIds != null && s.StudentIds.Contains(studentId))
                .ToListAsync();
            return Results.Ok(songs);
        });


        return app;
    }
}
