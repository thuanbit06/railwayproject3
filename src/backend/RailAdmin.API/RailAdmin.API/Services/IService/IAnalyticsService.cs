namespace RailAdmin.API.Services.IService;

public interface IAnalyticsService
{
    Task<object> GetAnalyticsAsync(string range = "Month");
}