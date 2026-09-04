// Services/AiService.cs

using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Services;

public class AiService : IAiService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _config;

    public AiService(
        HttpClient httpClient,
        IConfiguration config)
    {
        _httpClient = httpClient;
        _config = config;
    }

    public async Task<string> AskAsync(
        string systemPrompt,
        string userMessage)
    {
        if (string.IsNullOrWhiteSpace(userMessage))
        {
            return "Vui lòng nhập câu hỏi.";
        }

        // ============================================
        // OPENAI CONFIGURATION
        // ============================================

        var apiKey = _config["AI:ApiKey"];
        var baseUrl = _config["AI:BaseUrl"]?.TrimEnd('/');
        var model = _config["AI:Model"] ?? "gpt-5.6-luna";

        if (string.IsNullOrWhiteSpace(apiKey))
        {
            throw new InvalidOperationException(
                "AI:ApiKey is missing.");
        }

        if (string.IsNullOrWhiteSpace(baseUrl))
        {
            throw new InvalidOperationException(
                "AI:BaseUrl is missing.");
        }

        // ============================================
        // REQUEST BODY
        // ============================================

        var requestBody = new
        {
            model = model,

            input = new object[]
            {
                new
                {
                    role = "system",
                    content = new object[]
                    {
                        new
                        {
                            type = "input_text",
                            text = systemPrompt
                        }
                    }
                },

                new
                {
                    role = "user",
                    content = new object[]
                    {
                        new
                        {
                            type = "input_text",
                            text = userMessage
                        }
                    }
                }
            }
        };

        var json = JsonSerializer.Serialize(requestBody);

        // ============================================
        // HTTP REQUEST
        // ============================================

        using var request = new HttpRequestMessage(
            HttpMethod.Post,
            $"{baseUrl}/responses"
        );

        request.Headers.Authorization =
            new AuthenticationHeaderValue(
                "Bearer",
                apiKey
            );

        request.Content = new StringContent(
            json,
            Encoding.UTF8,
            "application/json"
        );

        // ============================================
        // DEBUG LOG
        // ============================================

        Console.WriteLine();
        Console.WriteLine("========== OPENAI REQUEST ==========");
        Console.WriteLine(
            $"URL: {baseUrl}/responses");
        Console.WriteLine(
            $"Model: {model}");
        Console.WriteLine(
            $"User message: {userMessage}");
        Console.WriteLine("====================================");

        // ============================================
        // SEND REQUEST
        // ============================================

        using var response =
            await _httpClient.SendAsync(request);

        var responseBody =
            await response.Content.ReadAsStringAsync();

        // ============================================
        // RESPONSE LOG
        // ============================================

        Console.WriteLine();
        Console.WriteLine("========== OPENAI RESPONSE ==========");
        Console.WriteLine(
            $"Status: {(int)response.StatusCode}");
        Console.WriteLine(responseBody);
        Console.WriteLine("======================================");

        // ============================================
        // ERROR
        // ============================================

        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException(
                $"OpenAI API error " +
                $"{(int)response.StatusCode}: " +
                responseBody
            );
        }

        // ============================================
        // PARSE RESPONSE
        // ============================================

        using var doc =
            JsonDocument.Parse(responseBody);

        var root = doc.RootElement;

        // Responses API trả output array.
        if (!root.TryGetProperty(
                "output",
                out var output))
        {
            throw new InvalidOperationException(
                $"OpenAI response does not contain " +
                $"output. Response: {responseBody}"
            );
        }

        foreach (var item in output.EnumerateArray())
        {
            if (!item.TryGetProperty(
                    "content",
                    out var content))
            {
                continue;
            }

            foreach (
                var contentItem
                in content.EnumerateArray())
            {
                if (!contentItem.TryGetProperty(
                        "type",
                        out var type))
                {
                    continue;
                }

                if (type.GetString() == "output_text" &&
                    contentItem.TryGetProperty(
                        "text",
                        out var text))
                {
                    var result =
                        text.GetString();

                    if (!string.IsNullOrWhiteSpace(result))
                    {
                        return result.Trim();
                    }
                }
            }
        }

        return "Xin lỗi, tôi không thể trả lời lúc này.";
    }
}