// DTOs/Request/Ai/ChatRequest.cs
namespace RailAdmin.API.DTOs.Request.Ai;

public class ChatRequest
{
    public string Message { get; set; } = string.Empty;

    /// <summary>
    /// Optional: PNR để AI trả lời đúng ngữ cảnh vé
    /// </summary>
    public string? PNR { get; set; }
}