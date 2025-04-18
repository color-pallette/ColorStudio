using System.Collections.Generic;
using System.Threading.Tasks;
using ColorStudio.DataAccess.Interface.Entities;

namespace ColorStudio.DataService.Interface.Services
{
    public interface ICustomerService
    {
        Task<IEnumerable<Customer>> GetAllCustomersAsync();
        Task<Customer?> GetCustomerByIdAsync(int id);
        Task<IEnumerable<Customer>> GetCustomersWithServicesAsync();
        Task<Customer?> GetCustomerWithServicesAsync(int id);
        Task<Customer?> GetCustomerByPhoneAsync(string phoneNumber);
        Task<Customer?> GetCustomerByEmailAsync(string email);
        Task<Customer> CreateCustomerAsync(Customer customer);
        Task<Customer> UpdateCustomerAsync(int id, Customer customer);
        Task<bool> DeleteCustomerAsync(int id);
    }
} 