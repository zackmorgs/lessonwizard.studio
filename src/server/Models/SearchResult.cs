using System.Text.Json.Serialization;

namespace Models;

public class SearchResult
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("type")]
    public string Type { get; set; } = string.Empty;

    [JsonPropertyName("spotifyTrackId")]
    public string? SpotifyTrackId { get; set; }
}
