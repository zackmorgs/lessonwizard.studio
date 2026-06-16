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
