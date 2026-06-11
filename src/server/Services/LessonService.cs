namespace MongoDB.Driver;
using Models;

namespace Services;

public class LessonService
{
    private readonly IMongoCollection<Lesson> _lessons;

    public LessonService(IMongoDatabase db)
    {
        _lessons = db.GetCollection<Lesson>("lessons");
    }

    public Task<List<Lesson>> GetByUserIdAsync(string userId) =>
        _lessons.Find(l => l.UserId == userId).ToListAsync();

    public Task<Lesson?> GetByIdAsync(string id) =>
        _lessons.Find(l => l.Id == id).FirstOrDefaultAsync();

    public async Task<Lesson> CreateAsync(Lesson lesson)
    {
        await _lessons.InsertOneAsync(lesson);
        return lesson;
    }

    public Task UpdateAsync(Lesson lesson) =>
        _lessons.ReplaceOneAsync(l => l.Id == lesson.Id, lesson);

    public Task DeleteAsync(string id) =>
        _lessons.DeleteOneAsync(l => l.Id == id);
}