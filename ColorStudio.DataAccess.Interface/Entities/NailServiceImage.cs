using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ColorStudio.DataAccess.Interface.Entities
{
    public class NailServiceImage : DataEntity
    {
        [Required]
        public int NailServiceId { get; set; }

        [Required]
        [MaxLength(255)]
        public string ImagePath { get; set; }

        [MaxLength(100)]
        public string? ImageTitle { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }

        // Navigation property
        public virtual NailService NailService { get; set; }
    }
} 