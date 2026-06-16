using System.Security.Claims;
using Models;
using MongoDB.Driver;

namespace Host.Endpoints;

public static class LessonEndpoints
{
    public static IEndpointRouteBuilder MapLessonEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/lessons").RequireAuthorization();

        // GET /api/lessons
        group.MapGet("/", async (ClaimsPrincipal user, IMongoDatabase db) =>
        {
            var teacherId = user.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? user.FindFirstValue("sub");
            if (teacherId is null) return Results.Unauthorized();

            var lessons = await db.GetCollection<Lesson>("lessons")
                .Find(l => l.TeacherId == teacherId)
                .ToListAsync();
            return Results.Ok(lessons);
        });

        // GET /api/lessons/tag/{tag}
        group.MapGet("/tag/{tag}", async (string tag, ClaimsPrincipal user, IMongoDatabase db) =>
        {
            var teacherId = user.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? user.FindFirstValue("sub");
            if (teacherId is null) return Results.Unauthorized();

            var lessons = await db.GetCollection<Lesson>("lessons")
                .Find(l => l.TeacherId == teacherId && l.TagIds != null && l.TagIds.Contains(tag))
                .ToListAsync();
            return Results.Ok(lessons);
        });

        // GET /api/lessons/pertinent
        group.MapGet("/pertinent", async (ClaimsPrincipal user, IMongoDatabase db) =>
        {
            var teacherId = user.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? user.FindFirstValue("sub");
            if (teacherId is null) return Results.Unauthorized();

            var allLessons = await db.GetCollection<Lesson>("lessons")
                .Find(l => l.TeacherId == teacherId)
                .ToListAsync();

            var lessonsNotBeforeToday = allLessons
                .Where(l => l.Date >= DateTime.UtcNow.Date)
                .ToList();

            return Results.Ok(lessonsNotBeforeToday);
        });


        // GET /api/lessons/today
        group.MapGet("/today", async (ClaimsPrincipal user, IMongoDatabase db) =>
        {
            var teacherId = user.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? user.FindFirstValue("sub");
            if (teacherId is null) return Results.Unauthorized();

            var todayUtc = DateTime.UtcNow.Date;
            var tomorrowUtc = todayUtc.AddDays(1);

            var lessons = await db.GetCollection<Lesson>("lessons")
                .Find(l => l.TeacherId == teacherId && l.Date >= todayUtc && l.Date < tomorrowUtc)
                .SortBy(l => l.Date)
                .ThenBy(l => l.Time)
                .ToListAsync();

            var studentIds = lessons
                .Select(l => l.StudentId)
                .Where(s => !string.IsNullOrEmpty(s))
                .Distinct()
                .ToList();
            var students = await db.GetCollection<Student>("students")
                .Find(s => studentIds.Contains(s.Id))
                .ToListAsync();
            var studentMap = students.ToDictionary(s => s.Id!, s => s.Name);

            var result = lessons.Select(l => new
            {
                l.Id,
                l.StudentId,
                StudentName = studentMap.TryGetValue(l.StudentId, out var name) ? name : null,
                l.Date,
                l.Instrument,
                l.Time,
                l.Notes,
                l.SongIds,
                l.TagIds,
                l.TeacherId,
            });

            return Results.Ok(result);
        });

        // GET /api/lessons/date/{date}
        group.MapGet("/date/{date}", async (string date, ClaimsPrincipal user, IMongoDatabase db) =>
        {
            var teacherId = user.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? user.FindFirstValue("sub");
            if (teacherId is null) return Results.Unauthorized();

            if (!DateTime.TryParse(date, out var parsedDate))
                return Results.BadRequest(new { message = "Invalid date format. Use YYYY-MM-DD." });

            var dayStartUtc = parsedDate.Date;
            var dayEndUtc = dayStartUtc.AddDays(1);

            var lessons = await db.GetCollection<Lesson>("lessons")
                .Find(l => l.TeacherId == teacherId && l.Date >= dayStartUtc && l.Date < dayEndUtc)
                .SortBy(l => l.Time)
                .ToListAsync();

            return Results.Ok(lessons);
        });

        // GET /api/lessons/month/{year}/{month}
        group.MapGet("/month/{year:int}/{month:int}", async (int year, int month, ClaimsPrincipal user, IMongoDatabase db) =>
        {
            var teacherId = user.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? user.FindFirstValue("sub");
            if (teacherId is null) return Results.Unauthorized();

            if (month < 1 || month > 12)
                return Results.BadRequest(new { message = "month must be between 1 and 12." });

            DateTime monthStartUtc;
            try
            {
                monthStartUtc = new DateTime(year, month, 1, 0, 0, 0, DateTimeKind.Utc);
            }
            catch (ArgumentOutOfRangeException)
            {
                return Results.BadRequest(new { message = "Invalid year or month." });
            }

            var monthEndUtc = monthStartUtc.AddMonths(1);

            var lessons = await db.GetCollection<Lesson>("lessons")
                .Find(l => l.TeacherId == teacherId && l.Date >= monthStartUtc && l.Date < monthEndUtc)
                .Project(l => l.Date)
                .ToListAsync();

            var days = lessons
                .Select(d => d.Day)
                .Distinct()
                .OrderBy(d => d)
                .ToList();

            return Results.Ok(days);
        });

        // GET /api/lessons/{id}
        group.MapGet("/{id}", async (string id, ClaimsPrincipal user, IMongoDatabase db) =>
        {
            var teacherId = user.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? user.FindFirstValue("sub");
            if (teacherId is null) return Results.Unauthorized();

            var lesson = await db.GetCollection<Lesson>("lessons")
                .Find(l => l.Id == id && l.TeacherId == teacherId)
                .FirstOrDefaultAsync();
            return lesson is null ? Results.NotFound() : Results.Ok(lesson);
        });

        // POST /api/lessons
        group.MapPost("/", async (Lesson lesson, ClaimsPrincipal user, IMongoDatabase db) =>
        {
            var teacherId = user.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? user.FindFirstValue("sub");
            if (teacherId is null) return Results.Unauthorized();

            if (string.IsNullOrEmpty(lesson.StudentId))
                return Results.BadRequest(new { message = "studentId is required." });
            if (lesson.Date == default)
                return Results.BadRequest(new { message = "date is required." });
            if (lesson.Time == TimeSpan.Zero)
                return Results.BadRequest(new { message = "time is required." });
            if (string.IsNullOrEmpty(lesson.Instrument))
                return Results.BadRequest(new { message = "instrument is required." });

            lesson.TeacherId = teacherId;
            await db.GetCollection<Lesson>("lessons").InsertOneAsync(lesson);
            return Results.Created($"/api/lessons/{lesson.Id}", lesson);
        });

        // PUT /api/lessons/{id}
        group.MapPut("/{id}", async (string id, Lesson updated, ClaimsPrincipal user, IMongoDatabase db) =>
        {
            var teacherId = user.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? user.FindFirstValue("sub");
            if (teacherId is null) return Results.Unauthorized();

            updated.Id = id;
            updated.TeacherId = teacherId;
            var result = await db.GetCollection<Lesson>("lessons")
                .ReplaceOneAsync(l => l.Id == id && l.TeacherId == teacherId, updated);
            return result.MatchedCount == 0 ? Results.NotFound() : Results.Ok(updated);
        });

        // DELETE /api/lessons/{id}
        group.MapDelete("/{id}", async (string id, ClaimsPrincipal user, IMongoDatabase db) =>
        {
            var teacherId = user.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? user.FindFirstValue("sub");
            if (teacherId is null) return Results.Unauthorized();

            var result = await db.GetCollection<Lesson>("lessons")
                .DeleteOneAsync(l => l.Id == id && l.TeacherId == teacherId);
            return result.DeletedCount == 0 ? Results.NotFound() : Results.NoContent();
        });

        return app;
    }
}
