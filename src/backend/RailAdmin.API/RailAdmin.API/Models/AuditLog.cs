    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using Microsoft.EntityFrameworkCore;

    namespace RailAdmin.API.Models;

    [Table("AuditLogs")]
    [Index(nameof(UserId), Name = "IX_AuditLogs_User")]
    [Index(nameof(CreatedAt), Name = "IX_AuditLogs_Date")]
    [Index(nameof(EntityType), Name = "IX_AuditLogs_EntityType")]
    public class AuditLog
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        public int? UserId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Action { get; set; } = string.Empty;

        [MaxLength(50)]
        public string? EntityType { get; set; }

        public int? EntityId { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }

        [MaxLength(45)]
        public string? IPAddress { get; set; }

        [Column(TypeName = "datetime2(7)")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string? OldValues { get; set; }

        public string? NewValues { get; set; }

        public int? DurationMs { get; set; }

        public bool? IsSuccess { get; set; } = true;

        // Navigation Property
        [ForeignKey(nameof(UserId))]
        public virtual User? User { get; set; }
    }