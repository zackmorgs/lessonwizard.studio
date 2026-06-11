using System.Security.Claims;
using Models;
using Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Host.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly UserService _users;
    private readonly TokenService _tokens;

    public AuthController(UserService users, TokenService tokens)
    {
        _users = users;
        _tokens = tokens;
    }

    // GET /api/auth/me
    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var id = User.FindFirstValue(ClaimTypes.NameIdentifier)
               ?? User.FindFirstValue("sub");

        if (id is null) return Unauthorized();

        var user = await _users.GetByIdAsync(id);
        if (user is null) return NotFound();

        return Ok(ToDto(user));
    }

    // GET /api/auth/google
    [HttpGet("google")]
    public IActionResult GoogleLogin([FromQuery] string? returnUrl = "/")
    {
        var props = new AuthenticationProperties
        {
            RedirectUri = Url.Action(nameof(GoogleCallback)),
            Items = { { "returnUrl", returnUrl ?? "/" } }
        };
        return Challenge(props, GoogleDefaults.AuthenticationScheme);
    }

    // GET /api/auth/google/callback
    [HttpGet("google/callback")]
    public async Task<IActionResult> GoogleCallback()
    {
        var result = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);

        if (!result.Succeeded)
            return Redirect("/?error=google_auth_failed");

        var googleId = result.Principal.FindFirstValue(ClaimTypes.NameIdentifier);
        var email    = result.Principal.FindFirstValue(ClaimTypes.Email) ?? "";
        var name     = result.Principal.FindFirstValue(ClaimTypes.Name);

        if (googleId is null)
            return Redirect("/?error=google_auth_failed");

        var user = await _users.GetByGoogleIdAsync(googleId)
                ?? await _users.GetByEmailAsync(email.ToLowerInvariant());

        if (user is null)
        {
            user = new User
            {
                Email = email.ToLowerInvariant(),
                GoogleId = googleId,
                DisplayName = name
            };
            await _users.CreateAsync(user);
        }
        else if (user.GoogleId is null)
        {
            user.GoogleId = googleId;
            await _users.UpdateAsync(user);
        }

        var token = _tokens.Generate(user);
        var returnUrl = result.Properties?.Items["returnUrl"] ?? "/";

        return Redirect($"{returnUrl}?token={token}");
    }

    private static object ToDto(User u) => new
    {
        id          = u.Id,
        email       = u.Email,
        displayName = u.DisplayName,
        hasGoogle   = u.GoogleId is not null
    };
}

