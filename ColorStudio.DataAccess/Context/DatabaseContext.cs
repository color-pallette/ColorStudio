using Microsoft.EntityFrameworkCore;
using ColorStudio.DataAccess.Interface.Entities;
using ColorStudio.DataAccess.Context.Configurations;

namespace ColorStudio.DataAccess.Context
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Color> Colors { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<NailService> NailServices { get; set; }
        public DbSet<NailServiceColor> NailServiceColors { get; set; }
        public DbSet<NailServiceImage> NailServiceImages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfiguration(new UserConfiguration());
            modelBuilder.ApplyConfiguration(new ColorConfiguration());
            modelBuilder.ApplyConfiguration(new CustomerConfiguration());
            modelBuilder.ApplyConfiguration(new NailServiceConfiguration());
        }
    }
}
