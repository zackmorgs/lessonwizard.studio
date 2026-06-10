using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Host.Models;

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("email")]
    public string Email { get; set; } = string.Empty;

    [BsonElement("passwordHash")]
    public string? PasswordHash { get; set; }

    [BsonElement("googleId")]
    public string? GoogleId { get; set; }

    [BsonElement("displayName")]
    public string? DisplayName { get; set; }

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
