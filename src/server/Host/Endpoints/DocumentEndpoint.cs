using System.Security.Claims;
using Models;
using MongoDB.Driver;

namespace Host.Endpoints;

public static class DocumentEndpoint
{
    public static IEndpointRouteBuilder MapDocumentEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/documents").RequireAuthorization();

        group.MapGet("/", async (ClaimsPrincipal user, IMongoCollection<Document> collection) =>
        {
            user = (System.Threading.Thread.CurrentPrincipal as ClaimsPrincipal) ?? user;
            var teacherId = user?.FindFirstValue(ClaimTypes.NameIdentifier)
              ?? user?.FindFirstValue("sub");
            if (teacherId is null) return Results.Unauthorized();
            var documents = await collection.Find(d => d.TeacherId == teacherId).ToListAsync();
            return Results.Ok(documents);
        });

        return app;



    }
}