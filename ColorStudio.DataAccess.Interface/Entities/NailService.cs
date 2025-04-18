using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ColorStudio.DataAccess.Interface.Entities
{
    public class NailService : DataEntity
    {
        [Required]
        public int CustomerId { get; set; }

        [Required]
        public DateTime ServiceDate { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPrice { get; set; }

        [MaxLength(500)]
        public string? Notes { get; set; }

        // Navigation properties
        public virtual Customer Customer { get; set; }
        public virtual ICollection<NailServiceColor> UsedColors { get; set; }
        public virtual ICollection<NailServiceImage> Images { get; set; }
    }
} 