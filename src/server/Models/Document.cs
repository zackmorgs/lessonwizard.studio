using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Models;

public class Document
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("teacherId")]
    public string TeacherId { get; set; } = string.Empty;

    [BsonElement("title")]
    public string Title { get; set; } = string.Empty;

    [BsonElement("description")]
    public string Description { get; set; } = string.Empty;

    [BsonElement("pdfUrl")]
    public string? PdfUrl { get; set; }

    [BsonElement("isSong")]
    public bool IsSong { get; set; } = false;

    [BsonElement("songId")]
    public string? SongId { get; set; }

    [BsonElement("tagIds")]
    public List<string> TagIds { get; set; } = new List<string>();
}