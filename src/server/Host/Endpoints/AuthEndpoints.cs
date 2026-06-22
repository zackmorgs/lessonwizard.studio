using System.Security.Claims;
using Models;
using Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.Extensions.Logging;

namespace Host.Endpoints;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/auth");

        // GET /api/auth/me
        group.MapGet("me", async (ClaimsPrincipal user, UserService users) =>
        {
            var id = user.FindFirstValue(ClaimTypes.NameIdentifier)
                   ?? user.FindFirstValue("sub");

            if (id is null) return Results.Unauthorized();

            var found = await users.GetByIdAsync(id);
            if (found is null) return Results.NotFound();

            return Results.Ok(ToDto(found));
        }).RequireAuthorization();

        // GET /api/auth/google
        group.MapGet("google", (HttpContext ctx, string? returnUrl = "/") =>
        {
            var props = new AuthenticationProperties
            {
                RedirectUri = "/api/auth/google/callback",
                Items = { { "returnUrl", returnUrl ?? "/" } }
            };
            return Results.Challenge(props, [GoogleDefaults.AuthenticationScheme]);
        });

        // GET /api/auth/google/callback
        group.MapGet("google/callback", async (HttpContext ctx, UserService users, TokenService tokens) =>
        {
            var result = await ctx.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);

            if (!result.Succeeded)
                return Results.Redirect("/?error=google_auth_failed");

            var googleId = result.Principal!.FindFirstValue(ClaimTypes.NameIdentifier);
            var email    = result.Principal!.FindFirstValue(ClaimTypes.Email) ?? "";
            var name     = result.Principal!.FindFirstValue(ClaimTypes.Name);

            if (googleId is null)
                return Results.Redirect("/?error=google_auth_failed");

            var user = await users.GetByGoogleIdAsync(googleId)
                    ?? await users.GetByEmailAsync(email.ToLowerInvariant());

            if (user is null)
            {
                user = new User
                {
                    Email       = email.ToLowerInvariant(),
                    GoogleId    = googleId,
                    DisplayName = name
                };
                await users.CreateAsync(user);
            }
            else if (user.GoogleId is null)
            {
                user.GoogleId = googleId;
                await users.UpdateAsync(user);
            }

            var token     = tokens.Generate(user);
            var returnUrl = result.Properties?.Items["returnUrl"] ?? "/";

            return Results.Redirect($"{returnUrl}?token={token}");
        });

        return app;
    }

    private static object ToDto(User u) => new
    {
        id          = u.Id,
        email       = u.Email,
        displayName = u.DisplayName,
        hasGoogle   = u.GoogleId is not null
    };
}
