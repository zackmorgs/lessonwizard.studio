using MongoDB.Bson;
using MongoDB.Driver;
using Tag = Models.Tag;

namespace Host.Endpoints;

public static class TagEndpoints
{
    public static IEndpointRouteBuilder MapTagEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/tags").RequireAuthorization();

        // GET /api/tags
        group.MapGet("/", async (IMongoDatabase db) =>
        {
            var tags = await db.GetCollection<Tag>("tags")
                .Find(_ => true)
                .ToListAsync();
            return Results.Ok(tags);
        });

        // GET /api/tags/counts
        // Returns { tagName: totalCount } across lessons + songs
        group.MapGet("/counts", async (IMongoDatabase db) =>
        {
            var pipeline = new[]
            {
                new BsonDocument("$unwind", "$tagIds"),
                new BsonDocument("$group", new BsonDocument
                {
                    { "_id", "$tagIds" },
                    { "count", new BsonDocument("$sum", 1) }
                })
            };

            var lessonCounts = await db.GetCollection<BsonDocument>("lessons")
                .Aggregate<BsonDocument>(pipeline)
                .ToListAsync();

            var songCounts = await db.GetCollection<BsonDocument>("songs")
                .Aggregate<BsonDocument>(pipeline)
                .ToListAsync();

            var merged = new Dictionary<string, int>();

            foreach (var doc in lessonCounts.Concat(songCounts))
            {
                var name = doc["_id"].AsString;
                var count = doc["count"].AsInt32;
                merged[name] = merged.TryGetValue(name, out var existing) ? existing + count : count;
            }

            return Results.Ok(merged);
        });

        // POST /api/tags
        group.MapPost("/", async (Tag tag, IMongoDatabase db) =>
        {
            var existing = await db.GetCollection<Tag>("tags")
                .Find(t => t.Name == tag.Name)
                .FirstOrDefaultAsync();

            if (existing is not null)
                return Results.Conflict(existing);

            await db.GetCollection<Tag>("tags").InsertOneAsync(tag);
            return Results.Created($"/api/tags/{tag.Id}", tag);
        });

        return app;
    }
}
