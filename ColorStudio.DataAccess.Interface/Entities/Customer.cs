using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ColorStudio.DataAccess.Interface.Entities
{
    public class Customer : DataEntity
    {
        [Required]
        [MaxLength(100)]
        public string FullName { get; set; }

        [Required]
        [MaxLength(100)]
        public string Email { get; set; }

        [Required]
        [MaxLength(20)]
        public string PhoneNumber { get; set; }

        [MaxLength(500)]
        public string? Address { get; set; }

        // Navigation property
        public virtual ICollection<NailService> Services { get; set; }
    }
} 