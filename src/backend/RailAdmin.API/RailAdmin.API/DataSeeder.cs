using RailAdmin.API.Data;
using RailAdmin.API.Models;

public static class DataSeeder
{
    public static void Seed(AppDbContext db)
    {
        if (!db.Trains.Any())
        {
            db.Trains.AddRange(
                new Train { TrainNo = "12002", TrainName = "Bhopal Shatabdi", FromStation = "New Delhi", ToStation = "Bhopal", DepartureTime = TimeSpan.Parse("06:00"), ArrivalTime = TimeSpan.Parse("14:30"), Status = "On Time" },
                new Train { TrainNo = "12431", TrainName = "Rajdhani Express", FromStation = "Mumbai", ToStation = "New Delhi", DepartureTime = TimeSpan.Parse("16:40"), ArrivalTime = TimeSpan.Parse("08:25"), Status = "Delayed 15m" }
            );
            db.SaveChanges();
        }
    }
}