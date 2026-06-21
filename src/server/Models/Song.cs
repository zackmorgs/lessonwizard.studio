using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Models;

public class Song
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("title")]
    public string Title { get; set; } = string.Empty;

    [BsonElement("artist")]
    public string Artist { get; set; } = string.Empty;

    [BsonElement("difficulty")]
    public int Difficulty { get; set; } = 0;

    [BsonElement("tuning")]
    public string Tuning { get; set; } = string.Empty;

    [BsonElement("tagIds")]
    public List<string> TagIds { get; set; } = new List<string>();

    [BsonElement("documentsId")]
    public List<string> documentsId { get; set; } = new List<string>(); 

    [BsonElement("isExplicit")]
    public bool IsExplicit { get; set; } = false;

    [BsonElement("spotifyTrackId")]
    public string? SpotifyTrackId { get; set; }

    [BsonElement("studentIds")]
    public List<string> StudentIds { get; set; } = new List<string>();

    [BsonElement("albumArtUrl")]
    public string? AlbumArtUrl { get; set; }
}