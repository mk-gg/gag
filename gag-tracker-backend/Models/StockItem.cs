using System;
using System.ComponentModel.DataAnnotations;

namespace gag_tracker_backend.Models
{
    public class StockItem
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        public int Quantity { get; set; }

        [MaxLength(100)]
        public string Category { get; set; } = string.Empty;

        [MaxLength(10)]
        public string Emoji { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Countdown { get; set; } = string.Empty;

        public DateTime LastUpdated { get; set; }
    }
}
