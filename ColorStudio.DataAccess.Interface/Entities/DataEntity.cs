using System;

namespace ColorStudio.DataAccess.Interface.Entities
{
    public abstract class DataEntity
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
