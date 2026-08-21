using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RailAdmin.API.Models;

public class FareRule
{
    // ========== 1. KHÓA CHÍNH ==========
    [Key]
    public int Id { get; set; }

    // ========== 2. THÔNG TIN LOẠI VÉ ==========
    /// <summary>
    /// Tên quy tắc giá (VD: Ngồi mềm điều hòa, Nằm khoang 4)
    /// </summary>
    [Required]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Mã loại chỗ (Dùng để mapping với Booking)
    /// VD: "SOFT_SEAT_AC", "SLEEPER_4"
    /// </summary>
    [Required]
    public string SeatClass { get; set; } = string.Empty;

    // ========== 3. THÔNG TIN GIÁ ==========
    /// <summary>
    /// Giá vé cơ bản (VND)
    /// </summary>
    [Required]
    [Column(TypeName = "decimal(18,2)")] // 👈 FIX LỖI CẢNH BÁO CỦA EM
    public decimal Price { get; set; }

    // ========== 4. ĐIỀU KIỆN ÁP DỤNG ==========
    /// <summary>
    /// Loại tàu áp dụng (VD: SE, TN, LP - Liên tỉnh, Địa phương)
    /// </summary>
    [Required]
    public string TrainType { get; set; } = string.Empty;

    /// <summary>
    /// Ga đi áp dụng (Để trống nếu áp dụng toàn tuyến)
    /// </summary>
    public string? DepartureStation { get; set; }

    /// <summary>
    /// Ga đến áp dụng (Để trống nếu áp dụng toàn tuyến)
    /// </summary>
    public string? ArrivalStation { get; set; }

    /// <summary>
    /// Mô tả chi tiết hoặc điều kiện đi kèm
    /// </summary>
    public string Description { get; set; } = string.Empty;

    // ========== 5. TRẠNG THÁI ==========
    /// <summary>
    /// Quy tắc này có đang được áp dụng không?
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Ngày tạo quy tắc
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}