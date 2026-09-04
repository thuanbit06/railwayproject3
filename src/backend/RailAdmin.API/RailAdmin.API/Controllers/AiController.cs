// Controllers/AiController.cs
using Microsoft.AspNetCore.Mvc;
using RailAdmin.API.DTOs.Request.Ai;
using RailAdmin.API.DTOs.Response;
using RailAdmin.API.Repository.IRepository;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AiController : ControllerBase
{
    private readonly IAiService _aiService;
    private readonly ITicketRepository _ticketRepository;
    private readonly IBookingRepository _bookingRepository;

    public AiController(
        IAiService aiService,
        ITicketRepository ticketRepository,
        IBookingRepository bookingRepository)
    {
        _aiService = aiService;
        _ticketRepository = ticketRepository;
        _bookingRepository = bookingRepository;
    }

    // =========================================================
    // POST /api/ai/chat
    // =========================================================

    [HttpPost("chat")]
    public async Task<ActionResult<AiChatResponse>> Chat([FromBody] ChatRequest dto)
    {
        if (dto == null || string.IsNullOrWhiteSpace(dto.Message))
            return BadRequest("Message is required.");

        var systemPrompt = """
            Bạn là trợ lý đặt vé tàu của hệ thống RailAdmin.
            Chỉ trả lời các chủ đề: trạng thái vé, PNR, quy định hủy vé, ghế, chuyến tàu, hoàn tiền.
            Không bịa số liệu. Nếu thiếu dữ liệu thì nói rõ là chưa có thông tin.
            Trả lời bằng tiếng Việt, ngắn gọn, lịch sự.
            """;

        // Nếu client gửi PNR → nạp context thật từ DB
        var userMessage = dto.Message.Trim();

        if (!string.IsNullOrWhiteSpace(dto.PNR))
        {
            var pnr = dto.PNR.Trim();
            var context = await BuildPnrContextAsync(pnr);

            if (!string.IsNullOrWhiteSpace(context))
            {
                userMessage = $"""
                    [Dữ liệu hệ thống]
                    {context}

                    [Câu hỏi của khách]
                    {userMessage}
                    """;
            }
        }

        try
        {
            var reply = await _aiService.AskAsync(systemPrompt, userMessage);

            return Ok(new AiChatResponse
            {
                Reply = reply
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "AI service error", detail = ex.Message });
        }
    }

    // =========================================================
    // BUILD CONTEXT TỪ PNR
    // =========================================================

    private async Task<string> BuildPnrContextAsync(string pnr)
    {
        var booking = await _bookingRepository.GetByPNRAsync(pnr);

        if (booking == null)
            return $"PNR '{pnr}' không tồn tại trong hệ thống.";

        var tickets = (await _ticketRepository.GetByPNRAsync(pnr)).ToList();

        var sb = new System.Text.StringBuilder();
        sb.AppendLine($"PNR: {pnr}");
        sb.AppendLine($"Trạng thái booking: {booking.BookingStatus}");
        sb.AppendLine($"Tổng hành khách: {booking.TotalPassengers}");
        sb.AppendLine($"Tổng tiền: {booking.TotalAmount:N0} VND");

        if (tickets.Any())
        {
            sb.AppendLine("Danh sách vé:");
            foreach (var t in tickets)
            {
                sb.AppendLine(
                    $"- TicketId={t.Id}, Hành khách={t.PassengerName}, " +
                    $"Ghế={(t.SeatId.HasValue ? t.SeatId.ToString() : "Chưa có")}, " +
                    $"Giá={t.Fare:N0}, Status={t.Status}");
            }
        }
        else
        {
            sb.AppendLine("Chưa có vé nào trong booking này.");
        }

        return sb.ToString();
    }
}