using MongoDB.Driver;
using Host.Models;

namespace Host.Services;

public class UserService
{
    private readonly IMongoCollection<User> _users;

    public UserService(IMongoDatabase db)
    {
        _users = db.GetCollection<User>("users");

        var emailIndex = new CreateIndexModel<User>(
            Builders<User>.IndexKeys.Ascending(u => u.Email),
            new CreateIndexOptions { Unique = true }
        );
        _users.Indexes.CreateOne(emailIndex);
    }

    public Task<User?> GetByIdAsync(string id) =>
        _users.Find(u => u.Id == id).FirstOrDefaultAsync();

    public Task<User?> GetByEmailAsync(string email) =>
        _users.Find(u => u.Email == email).FirstOrDefaultAsync();

    public Task<User?> GetByGoogleIdAsync(string googleId) =>
        _users.Find(u => u.GoogleId == googleId).FirstOrDefaultAsync();

    public async Task<User> CreateAsync(User user)
    {
        await _users.InsertOneAsync(user);
        return user;
    }

    public Task UpdateAsync(User user) =>
        _users.ReplaceOneAsync(u => u.Id == user.Id, user);
}
