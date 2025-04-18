using ColorStudio.DataAccess.Interface.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ColorStudio.DataAccess.Context.Configurations
{
    public class ColorConfiguration : IEntityTypeConfiguration<Color>
    {
        public void Configure(EntityTypeBuilder<Color> builder)
        {
            builder.HasKey(c => c.Id);

            builder.Property(c => c.Name)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(c => c.HexCode)
                .IsRequired()
                .HasMaxLength(7);

            builder.Property(c => c.Brand)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(c => c.Price)
                .IsRequired()
                .HasPrecision(18, 2);

            builder.Property(c => c.Stock)
                .IsRequired();

            builder.Property(c => c.Description)
                .HasMaxLength(500);

            builder.Property(c => c.Volume)
                .IsRequired()
                .HasPrecision(10, 2);

            // Image properties configuration
            builder.Property(c => c.ImagePath)
                .HasMaxLength(255);

            builder.Property(c => c.ImageTitle)
                .HasMaxLength(100);

            builder.Property(c => c.ImageUploadedAt)
                .IsRequired(false);

            // Base entity properties
            builder.Property(c => c.CreatedAt)
                .IsRequired()
                .HasDefaultValue(DateTime.UtcNow);

            builder.Property(c => c.UpdatedAt)
                .IsRequired()
                .HasDefaultValue(DateTime.UtcNow);
        }
    }
}
