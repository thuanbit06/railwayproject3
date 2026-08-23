using RailAdmin.API.Data;
using RailAdmin.API.Models;

public static class DataSeeder
{
    public static void Seed(AppDbContext db)
    {
        if (!db.Trains.Any())
        {
            db.Trains.AddRange(
                new Train { TrainNo = "12002", TrainName = "Bhopal Shatabdi", TrainType = "Express" },
                new Train { TrainNo = "12431", TrainName = "Rajdhani Express", TrainType = "Express" }
            );
            db.SaveChanges();
        }
    }
}