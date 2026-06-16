using System.Text;
using Services;
using Host.Endpoints;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

// MongoDB
var mongoConnectionString = builder.Configuration.GetConnectionString("MongoDB")
    ?? "mongodb://localhost:27017";
builder.Services.AddSingleton<IMongoClient>(new MongoClient(mongoConnectionString));
builder.Services.AddSingleton(sp =>
    sp.GetRequiredService<IMongoClient>().GetDatabase(
        builder.Configuration["MongoDB:Database"] ?? "zoilerplate"
    ));

// App services
builder.Services.AddSingleton<UserService>();
builder.Services.AddSingleton<TokenService>();

// JWT authentication
var jwtKey = builder.Configuration["Jwt:Key"]!;
var googleClientId = builder.Configuration["Authentication:Google:ClientId"];
var googleClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
var hasGoogle = !string.IsNullOrEmpty(googleClientId) && !string.IsNullOrEmpty(googleClientSecret);

var authBuilder = builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme    = JwtBearerDefaults.AuthenticationScheme;
    // Google OAuth needs a cookie-based sign-in scheme to store the external
    // identity between the challenge redirect and the callback.
    if (hasGoogle)
        options.DefaultSignInScheme = "ExternalCookie";
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer           = true,
        ValidateAudience         = true,
        ValidateLifetime         = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer              = builder.Configuration["Jwt:Issuer"],
        ValidAudience            = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

if (hasGoogle)
{
    authBuilder
        .AddCookie("ExternalCookie")
        .AddGoogle(options =>
        {
            options.ClientId     = googleClientId!;
            options.ClientSecret = googleClientSecret!;
            options.SignInScheme = "ExternalCookie";
        });
}

builder.Services.AddAuthorization();
builder.Services.AddHttpClient();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Serve the React SPA from wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapAuthEndpoints();
app.MapLessonEndpoints();
app.MapStudentEndpoints();
app.MapSongEndpoints();
app.MapSpotifyEndpoints();
app.MapTagEndpoints();

// Fall back to index.html for client-side routing
app.MapFallbackToFile("index.html");

app.Run();
