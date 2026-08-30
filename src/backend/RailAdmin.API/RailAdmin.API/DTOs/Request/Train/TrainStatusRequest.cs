using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs.Request.Train;

public class TrainStatusRequest
{
    [Required]
    public bool IsActive { get; set; }
}