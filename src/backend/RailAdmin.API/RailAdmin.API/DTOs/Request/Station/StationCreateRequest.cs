using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs.Request.Station
{
    public class StationCreateRequest
    {
        [Required, MaxLength(10)]
        public string Code { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string City { get; set; } = string.Empty;
    }
}
