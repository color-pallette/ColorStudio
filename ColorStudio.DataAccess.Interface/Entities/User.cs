using System;
using System.ComponentModel.DataAnnotations;

namespace ColorStudio.DataAccess.Interface.Entities
{
    public class User : DataEntity
    {
        [Required]
        [MaxLength(100)]
        public string FullName { get; set; }

        [Required]
        [MaxLength(100)]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        [MaxLength(50)]
        public string? Role { get; set; } // Admin, User, etc.

        public int Id { get; set; }
        public string Username { get; set; }
        public string Salt { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public bool IsActive { get; set; }
    }
}
