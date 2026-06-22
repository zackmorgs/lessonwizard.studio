using System.Security.Claims;

using Models;
using MongoDB.Driver;

using Serilog;

namespace Host.Endpoints;

public static class SongEndpoints
{
    public static IEndpointRouteBuilder MapSongEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/songs").RequireAuthorization();
        
        // GET /api/songs
        group.MapGet("/", async (ClaimsPrincipal user, IMongoDatabase db) =>
        {
            try
            {
                var teacherId = user.FindFirstValue(ClaimTypes.NameIdentifier)
                         ?? user.FindFirstValue("sub");
                if (teacherId is null) return Results.Unauthorized();

                var songs = await db.GetCollection<Song>("songs")
                    .Find(_ => true)
                    .ToListAsync();
                return Results.Ok(songs);
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error retrieving songs");
                return Results.Problem("An error occurred while retrieving songs.");
            }
        });

        // GET /api/songs/{id}
        group.MapGet("/{id}", async (string id, ClaimsPrincipal user, IMongoDatabase db) =>
        {
            try
            {
                var song = await db.GetCollection<Song>("songs")
                .Find(s => s.Id == id)
                .FirstOrDefaultAsync();
                return song is null ? Results.NotFound() : Results.Ok(song);
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error retrieving song");
                return Results.Problem("An error occurred while retrieving the song.");
            }
        });

        // POST /api/songs
        group.MapPost("/", async (Song song, IMongoDatabase db) =>
        {
            try
            {
                // Console.WriteLine($"Creating song: {song.AlbumArtUrl}");
                // check if song is already in datab
                var existingSong = await db.GetCollection<Song>("songs")
                    .Find(s => (s.Title == song.Title && s.Artist == song.Artist))
                    .FirstOrDefaultAsync();

                if (existingSong != null)
                {
                    Log.Warning("Duplicate song detected: {SongId}", song.Id);
                    return Results.Conflict($"Song with ID {song.Id} already exists.");
                }

                await db.GetCollection<Song>("songs").InsertOneAsync(song);
                return Results.Created($"/api/songs/{song.Id}", song);
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error creating song");
                return Results.Problem("An error occurred while creating the song.");
            }
        });

        // PUT /api/songs/{id}
        group.MapPut("/{id}", async (string id, Song updated, IMongoDatabase db) =>
        {
            try
            {
                updated.Id = id;
                var result = await db.GetCollection<Song>("songs")
                    .ReplaceOneAsync(s => s.Id == id, updated);
                return result.MatchedCount == 0 ? Results.NotFound() : Results.Ok(updated);
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error updating song");
                return Results.Problem("An error occurred while updating the song.");
            }
        });

        // DELETE /api/songs/{id}
        group.MapDelete("/{id}", async (string id, IMongoDatabase db) =>
        {
            try
            {
                var result = await db.GetCollection<Song>("songs")
                .DeleteOneAsync(s => s.Id == id);
                return result.DeletedCount == 0 ? Results.NotFound() : Results.NoContent();
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error deleting song");
                return Results.Problem("An error occurred while deleting the song.");
            }
        });

        group.MapGet("/tag/{tag}/songs/", async (string tag, IMongoDatabase db) =>
        {
            try
            {
                var songs = await db.GetCollection<Song>("songs")
                .Find(s => s.TagIds != null && s.TagIds.Contains(tag))
                .ToListAsync();
                return Results.Ok(songs);
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error retrieving songs by tag");
                return Results.Problem("An error occurred while retrieving songs by tag.");
            }
        });


        group.MapGet("/tag/{tag}/lessons/", async (string tag, IMongoDatabase db) =>
        {
            try
            {
                var lessons = await db.GetCollection<Models.Lesson>("lessons")
                .Find(s => s.TagIds != null && s.TagIds.Contains(tag))
                .ToListAsync();
                return Results.Ok(lessons);
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error retrieving lessons by tag");
                return Results.Problem("An error occurred while retrieving lessons by tag.");
            }
        });


        group.MapGet("/student/{studentId}", async (string studentId, IMongoDatabase db) =>
        {
            try
            {
                var songs = await db.GetCollection<Models.Song>("songs")
                .Find(s => s.StudentIds != null && s.StudentIds.Contains(studentId))
                .ToListAsync();
                return Results.Ok(songs);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving songs by student: {ex.Message}");
                return Results.Problem("An error occurred while retrieving songs by student.");
            }
        });


        return app;
    }
}
