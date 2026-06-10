using System.Security.Claims;
using Host.Models;
using Host.Services;
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

    // POST /api/auth/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        if (await _users.GetByEmailAsync(req.Email) is not null)
            return Conflict(new { message = "Email already in use." });

        var user = new User
        {
            Email = req.Email.ToLowerInvariant(),
            DisplayName = req.DisplayName,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password)
        };

        await _users.CreateAsync(user);

        return Ok(new { token = _tokens.Generate(user), user = ToDto(user) });
    }

    // POST /api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var user = await _users.GetByEmailAsync(req.Email.ToLowerInvariant());

        if (user is null || user.PasswordHash is null ||
            !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid email or password." });

        return Ok(new { token = _tokens.Generate(user), user = ToDto(user) });
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
        hasPassword = u.PasswordHash is not null,
        hasGoogle   = u.GoogleId is not null
    };
}

public record RegisterRequest(string Email, string Password, string? DisplayName);
public record LoginRequest(string Email, string Password);
