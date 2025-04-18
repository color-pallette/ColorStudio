using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ColorStudio.DataAccess.Interface.Entities;

namespace ColorStudio.DataAccess.Context.Configurations
{
    public class NailServiceConfiguration : IEntityTypeConfiguration<NailService>
    {
        public void Configure(EntityTypeBuilder<NailService> builder)
        {
            builder.HasKey(s => s.Id);

            builder.Property(s => s.CustomerId)
                .IsRequired();

            builder.Property(s => s.ServiceDate)
                .IsRequired();

            builder.Property(s => s.TotalPrice)
                .IsRequired()
                .HasColumnType("decimal(18,2)");

            builder.Property(s => s.Notes)
                .HasMaxLength(500);

            builder.Property(s => s.CreatedAt)
                .IsRequired();

            builder.Property(s => s.UpdatedAt)
                .IsRequired(false);

            // Configure one-to-many relationship with Customer
            builder.HasOne(s => s.Customer)
                .WithMany(c => c.Services)
                .HasForeignKey(s => s.CustomerId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure one-to-many relationship with NailServiceColor
            builder.HasMany(s => s.UsedColors)
                .WithOne(sc => sc.NailService)
                .HasForeignKey(sc => sc.NailServiceId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure one-to-many relationship with NailServiceImage
            builder.HasMany(s => s.Images)
                .WithOne(i => i.NailService)
                .HasForeignKey(i => i.NailServiceId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }

    public class NailServiceColorConfiguration : IEntityTypeConfiguration<NailServiceColor>
    {
        public void Configure(EntityTypeBuilder<NailServiceColor> builder)
        {
            builder.HasKey(nsc => nsc.Id);

            builder.Property(nsc => nsc.Quantity)
                .IsRequired()
                .HasDefaultValue(1);

            // Relationships
            builder.HasOne(nsc => nsc.NailService)
                .WithMany(ns => ns.UsedColors)
                .HasForeignKey(nsc => nsc.NailServiceId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(nsc => nsc.Color)
                .WithMany()
                .HasForeignKey(nsc => nsc.ColorId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }

    public class NailServiceImageConfiguration : IEntityTypeConfiguration<NailServiceImage>
    {
        public void Configure(EntityTypeBuilder<NailServiceImage> builder)
        {
            builder.HasKey(nsi => nsi.Id);

            builder.Property(nsi => nsi.ImagePath)
                .IsRequired()
                .HasMaxLength(255);

            builder.Property(nsi => nsi.ImageTitle)
                .HasMaxLength(100);

            builder.Property(nsi => nsi.Description)
                .HasMaxLength(500);

            // Relationship
            builder.HasOne(nsi => nsi.NailService)
                .WithMany(ns => ns.Images)
                .HasForeignKey(nsi => nsi.NailServiceId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
} 