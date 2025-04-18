using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using ColorStudio.DataAccess.Context;
using ColorStudio.DataAccess.Interface.Entities;
using ColorStudio.DataAccess.Interface.Repositories;

namespace ColorStudio.DataAccess.Repositories
{
    public class CustomerRepository : Repository<Customer>, ICustomerRepository
    {
        private readonly DatabaseContext _context;

        public CustomerRepository(DatabaseContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Customer>> GetCustomersWithServicesAsync()
        {
            return await _context.Customers
                .Include(c => c.Services)
                .ToListAsync();
        }

        public async Task<Customer?> GetCustomerWithServicesAsync(int id)
        {
            return await _context.Customers
                .Include(c => c.Services)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Customer?> GetCustomerByPhoneAsync(string phoneNumber)
        {
            return await _context.Customers
                .Include(c => c.Services)
                .FirstOrDefaultAsync(c => c.PhoneNumber == phoneNumber);
        }

        public async Task<Customer?> GetCustomerByEmailAsync(string email)
        {
            return await _context.Customers
                .Include(c => c.Services)
                .FirstOrDefaultAsync(c => c.Email == email);
        }
    }
} 