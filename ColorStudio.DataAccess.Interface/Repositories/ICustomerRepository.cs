using System.Collections.Generic;
using System.Threading.Tasks;
using ColorStudio.DataAccess.Interface.Entities;

namespace ColorStudio.DataAccess.Interface.Repositories
{
    public interface ICustomerRepository : IRepository<Customer>
    {
        Task<IEnumerable<Customer>> GetCustomersWithServicesAsync();
        Task<Customer?> GetCustomerWithServicesAsync(int id);
        Task<Customer?> GetCustomerByPhoneAsync(string phoneNumber);
        Task<Customer?> GetCustomerByEmailAsync(string email);
    }
} 