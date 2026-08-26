namespace RailAdmin.API.DTOs.Response
{
    // Response chuẩn hóa trả về thông báo chung
    public class ApiResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
