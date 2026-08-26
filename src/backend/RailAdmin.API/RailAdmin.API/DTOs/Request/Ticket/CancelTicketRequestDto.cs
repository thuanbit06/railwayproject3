namespace RailAdmin.API.DTOs.Request.Ticket
{
    // Request gửi lên khi Admin thực hiện hủy vé
    public class CancelTicketRequestDto
    {
        public string? Reason { get; set; }
    }
}
