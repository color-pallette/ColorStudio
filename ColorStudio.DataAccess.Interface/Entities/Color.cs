using System;
using System.ComponentModel.DataAnnotations;

namespace ColorStudio.DataAccess.Interface.Entities
{
    public class Color : DataEntity
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        [MaxLength(7)]
        public string HexCode { get; set; }

        [Required]
        [MaxLength(100)]
        public string Brand { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }

        [Range(0, int.MaxValue)]
        public int Stock { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }

        [Range(0, 100)]
        public decimal Volume { get; set; } // in milliliters

        // Image properties
        [MaxLength(255)]
        public string? ImagePath { get; set; }

        [MaxLength(100)]
        public string? ImageTitle { get; set; }

        public DateTime? ImageUploadedAt { get; set; }
    }
} 