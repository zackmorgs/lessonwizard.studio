using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Models;
public class SearchResult
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
}
