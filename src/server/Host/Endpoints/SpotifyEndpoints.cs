using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace Host.Endpoints;

public static class SpotifyEndpoints
{
    public static IEndpointRouteBuilder MapSpotifyEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/spotify").RequireAuthorization();

        // GET /api/spotify/search?q=...
        group.MapGet("/search", async (string q, IConfiguration config, IHttpClientFactory http) =>
        {
            if (string.IsNullOrWhiteSpace(q))
                return Results.BadRequest("Query parameter 'q' is required.");

            var clientId     = config["Spotify:ClientId"];
            var clientSecret = config["Spotify:ClientSecret"];

            if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(clientSecret))
                return Results.Problem("Spotify credentials are not configured.");

            var client = http.CreateClient();

            // Obtain a Client Credentials token
            var credentials = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{clientId}:{clientSecret}"));
            var tokenRequest = new HttpRequestMessage(HttpMethod.Post, "https://accounts.spotify.com/api/token")
            {
                Headers = { Authorization = new AuthenticationHeaderValue("Basic", credentials) },
                Content = new FormUrlEncodedContent([new("grant_type", "client_credentials")])
            };

            var tokenResponse = await client.SendAsync(tokenRequest);
            if (!tokenResponse.IsSuccessStatusCode)
                return Results.Problem("Failed to authenticate with Spotify.");

            var tokenJson  = await tokenResponse.Content.ReadAsStringAsync();
            var tokenDoc   = JsonDocument.Parse(tokenJson);
            var accessToken = tokenDoc.RootElement.GetProperty("access_token").GetString();

            // Search tracks
            var searchUrl = $"https://api.spotify.com/v1/search?q={Uri.EscapeDataString(q)}&type=track&limit=10";
            var searchRequest = new HttpRequestMessage(HttpMethod.Get, searchUrl);
            searchRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var searchResponse = await client.SendAsync(searchRequest);
            if (!searchResponse.IsSuccessStatusCode)
                return Results.Problem("Spotify search request failed.");

            var searchJson = await searchResponse.Content.ReadAsStringAsync();
            var searchDoc  = JsonDocument.Parse(searchJson);
            var items      = searchDoc.RootElement
                .GetProperty("tracks")
                .GetProperty("items");

            var results = items.EnumerateArray().Select(track => new
            {
                id         = track.GetProperty("id").GetString(),
                name       = track.GetProperty("name").GetString(),
                artist     = track.GetProperty("artists")[0].GetProperty("name").GetString(),
                album      = track.GetProperty("album").GetProperty("name").GetString(),
                albumArt   = track.GetProperty("album")
                                  .GetProperty("images")
                                  .EnumerateArray()
                                  .LastOrDefault()
                                  .ValueKind != JsonValueKind.Undefined
                             ? track.GetProperty("album").GetProperty("images").EnumerateArray().Last().GetProperty("url").GetString()
                             : null,
                previewUrl = track.TryGetProperty("preview_url", out var prev) && prev.ValueKind == JsonValueKind.String
                             ? prev.GetString()
                             : null,
                spotifyUrl = track.GetProperty("external_urls").GetProperty("spotify").GetString(),
                isExplicit = track.TryGetProperty("explicit", out var exp) && exp.ValueKind == JsonValueKind.True
            }).ToList();

            return Results.Ok(results);
        });

        // GET /api/spotify/track/{id}/album-art/
        group.MapGet("/track/{id}/album-art/", async (string id, IConfiguration config, IHttpClientFactory http) =>
        {
            var clientId     = config["Spotify:ClientId"];
            var clientSecret = config["Spotify:ClientSecret"];

            if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(clientSecret))
                return Results.Problem("Spotify credentials are not configured.");

            var client = http.CreateClient();

            var credentials = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{clientId}:{clientSecret}"));
            var tokenRequest = new HttpRequestMessage(HttpMethod.Post, "https://accounts.spotify.com/api/token")
            {
                Headers = { Authorization = new AuthenticationHeaderValue("Basic", credentials) },
                Content = new FormUrlEncodedContent([new("grant_type", "client_credentials")])
            };

            var tokenResponse = await client.SendAsync(tokenRequest);
            if (!tokenResponse.IsSuccessStatusCode)
                return Results.Problem("Failed to authenticate with Spotify.");

            var tokenJson   = await tokenResponse.Content.ReadAsStringAsync();
            var tokenDoc    = JsonDocument.Parse(tokenJson);
            var accessToken = tokenDoc.RootElement.GetProperty("access_token").GetString();

            var trackRequest = new HttpRequestMessage(HttpMethod.Get, $"https://api.spotify.com/v1/tracks/{id}");
            trackRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var trackResponse = await client.SendAsync(trackRequest);
            if (!trackResponse.IsSuccessStatusCode)
                return Results.NotFound("Track not found.");

            var trackJson = await trackResponse.Content.ReadAsStringAsync();
            var trackDoc  = JsonDocument.Parse(trackJson);

            var images = trackDoc.RootElement
                .GetProperty("album")
                .GetProperty("images")
                .EnumerateArray()
                .ToList();

            if (images.Count == 0)
                return Results.NotFound("No album art found.");

            var url = images[0].GetProperty("url").GetString();
            return Results.Ok(new { url });
        });

        return app;
    }
}
