using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RailAdmin.API.Models;

public class Booking
{
    // ========== 1. KHÓA CHÍNH ==========
    [Key]
    public int Id { get; set; }

    // ========== 2. THÔNG TIN THỜI GIAN ==========
    /// <summary>
    /// Ngày giờ đặt vé (Tự động tạo bởi DB)
    /// </summary>
    [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
    public DateTime CreatedAt { get; set; }

    // ========== 3. THÔNG TIN HÀNH KHÁCH ==========
    /// <summary>
    /// Tên hành khách (Lấy từ User.Name hoặc nhập tay)
    /// </summary>
    [Required]
    public string PassengerName { get; set; } = string.Empty;

    /// <summary>
    /// Email liên hệ
    /// </summary>
    [Required]
    [EmailAddress]
    public string PassengerEmail { get; set; } = string.Empty;

    /// <summary>
    /// Số điện thoại liên hệ
    /// </summary>
    [Required]
    public string PassengerPhone { get; set; } = string.Empty;

    // ========== 4. THÔNG TIN HÀNH TRÌNH ==========
    /// <summary>
    /// Mã chuyến tàu (VD: SE1, SE2, TN4)
    /// </summary>
    [Required]
    public string TrainNumber { get; set; } = string.Empty;

    /// <summary>
    /// Tên chuyến tàu (VD: Thống Nhất)
    /// </summary>
    [Required]
    public string TrainName { get; set; } = string.Empty;

    /// <summary>
    /// Ga đi
    /// </summary>
    [Required]
    public string DepartureStation { get; set; } = string.Empty;

    /// <summary>
    /// Ga đến
    /// </summary>
    [Required]
    public string ArrivalStation { get; set; } = string.Empty;

    /// <summary>
    /// Ngày đi
    /// </summary>
    [Required]
    public DateTime JourneyDate { get; set; }

    /// <summary>
    /// Giờ khởi hành (VD: 19:30)
    /// </summary>
    [Required]
    public TimeSpan DepartureTime { get; set; }

    /// <summary>
    /// Giờ đến nơi
    /// </summary>
    [Required]
    public TimeSpan ArrivalTime { get; set; }

    // ========== 5. THÔNG TIN VÉ & TOA ==========
    /// <summary>
    /// Loại chỗ (VD: Ngồi mềm điều hòa, Nằm khoang 4)
    /// </summary>
    [Required]
    public string SeatClass { get; set; } = string.Empty;

    /// <summary>
    /// Số toa
    /// </summary>
    [Required]
    public string CoachNumber { get; set; } = string.Empty;

    /// <summary>
    /// Số ghế (VD: A12, B05)
    /// </summary>
    [Required]
    public string SeatNumber { get; set; } = string.Empty;

    /// <summary>
    /// Mã định danh vé (PNR - Passenger Name Record)
    /// Đây là mã quan trọng nhất để tra cứu vé
    /// </summary>
    [Required]
    public string Pnr { get; set; } = string.Empty;

    // ========== 6. THANH TOÁN & TRẠNG THÁI ==========
    /// <summary>
    /// Tổng số tiền thanh toán
    /// </summary>
    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalAmount { get; set; }

    /// <summary>
    /// Trạng thái vé: Pending (Chờ thanh toán), Confirmed (Đã xác nhận), Cancelled (Đã hủy), Refunded (Đã hoàn tiền)
    /// </summary>
    [Required]
    public string Status { get; set; } = "Pending";

    /// <summary>
    /// Phương thức thanh toán (VD: VNPay, Momo, Cash)
    /// </summary>
    public string? PaymentMethod { get; set; }

    /// <summary>
    /// Mã giao dịch từ cổng thanh toán
    /// </summary>
    public string? TransactionId { get; set; }

    // ========== 7. QUAN HỆ KHÓA NGOẠI (RẤT QUAN TRỌNG) ==========
    /// <summary>
    /// ID của User đã đặt vé (Liên kết với bảng Users)
    /// </summary>
    public int UserId { get; set; }

    [ForeignKey("UserId")]
    public virtual User? User { get; set; }
}