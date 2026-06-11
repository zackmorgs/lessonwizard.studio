using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Models;

public class Lesson
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("date")]
    public DateTime Date { get; set; } = DateTime.UtcNow;

    [BsonElement("time")]
    public TimeSpan Time { get; set; } = TimeSpan.Zero;

    [BsonElement("notes")]
    public string Notes { get; set; } = string.Empty;

    [BsonElement("songIds")]
    public List<string> SongIds { get; set; } = new List<string>();

    [BsonElement("tagIds")]
    public List<string> TagIds { get; set; } = new List<string>();
}
