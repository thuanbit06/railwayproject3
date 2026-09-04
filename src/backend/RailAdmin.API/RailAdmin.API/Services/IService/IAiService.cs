// Services/IService/IAiService.cs
namespace RailAdmin.API.Services.IService;

public interface IAiService
{
    Task<string> AskAsync(string systemPrompt, string userMessage);
}