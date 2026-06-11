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

    [BsonElement("lessons")]
    public List<string> Lessons { get; set; } = new List<string>();

    [BsonElement("songs")]
    public List<string> Songs { get; set; } = new List<string>();

    [BsonElement("goals")]
    public string Goals { get; set; } = string.Empty;
}

// - Student
//     - Name 
//     - Age
//     - Lessons
//     - Songs
//     - Goals
