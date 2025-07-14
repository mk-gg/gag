using System;
using System.ComponentModel.DataAnnotations;

namespace gag_tracker_backend.Models
{
    public class StockItem
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; }


        public int Quantity { get; set; }

        [MaxLength(100)]
        public String Category { get; set; }

        public DateTime LastUpdated { get; set; }

    }
}
