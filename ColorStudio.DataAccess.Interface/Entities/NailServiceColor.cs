using System.ComponentModel.DataAnnotations;

namespace ColorStudio.DataAccess.Interface.Entities
{
    public class NailServiceColor : DataEntity
    {
        [Required]
        public int NailServiceId { get; set; }
        
        [Required]
        public int ColorId { get; set; }

        [Range(1, 20)]
        public int Quantity { get; set; }

        // Navigation properties
        public virtual NailService NailService { get; set; }
        public virtual Color Color { get; set; }
    }
} 