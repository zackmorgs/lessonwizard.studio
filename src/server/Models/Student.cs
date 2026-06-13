using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Models;

public class Student
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("age")]
    public int Age { get; set; }

    [BsonElement("instruments")]
    public List<string> Instruments { get; set; } = new List<string>();

    [BsonElement("songIds")]
    public List<string> SongIds { get; set; } = new List<string>();

    [BsonElement("goals")]
    public string Goals { get; set; } = string.Empty;

    [BsonElement("teacherId")]
    public string TeacherId { get; set; } = string.Empty;
}
