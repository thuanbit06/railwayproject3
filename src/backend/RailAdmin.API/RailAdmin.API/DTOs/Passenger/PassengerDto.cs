namespace RailAdmin.API.DTOs.Passenger
{
    public class PassengerDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty; public int Age { get; set; }
        public string Gender { get; set; } = string.Empty; public string? IDProofType { get; set; }
        public string? IDProofNo { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
    }
}
