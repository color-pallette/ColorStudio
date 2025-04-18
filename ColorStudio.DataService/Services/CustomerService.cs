using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ColorStudio.DataAccess.Interface;
using ColorStudio.DataAccess.Interface.Entities;
using ColorStudio.DataAccess.Interface.Repositories;
using ColorStudio.DataService.Interface.Services;

namespace ColorStudio.DataService.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CustomerService(ICustomerRepository customerRepository, IUnitOfWork unitOfWork)
        {
            _customerRepository = customerRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<Customer>> GetAllCustomersAsync()
        {
            return await _customerRepository.GetAllAsync();
        }

        public async Task<Customer?> GetCustomerByIdAsync(int id)
        {
            return await _customerRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Customer>> GetCustomersWithServicesAsync()
        {
            return await _customerRepository.GetCustomersWithServicesAsync();
        }

        public async Task<Customer?> GetCustomerWithServicesAsync(int id)
        {
            return await _customerRepository.GetCustomerWithServicesAsync(id);
        }

        public async Task<Customer?> GetCustomerByPhoneAsync(string phoneNumber)
        {
            return await _customerRepository.GetCustomerByPhoneAsync(phoneNumber);
        }

        public async Task<Customer?> GetCustomerByEmailAsync(string email)
        {
            return await _customerRepository.GetCustomerByEmailAsync(email);
        }

        public async Task<Customer> CreateCustomerAsync(Customer customer)
        {
            if (await _customerRepository.GetCustomerByPhoneAsync(customer.PhoneNumber) != null)
                throw new InvalidOperationException("A customer with this phone number already exists.");

            if (!string.IsNullOrEmpty(customer.Email) && await _customerRepository.GetCustomerByEmailAsync(customer.Email) != null)
                throw new InvalidOperationException("A customer with this email already exists.");

            customer.CreatedAt = DateTime.UtcNow;
            await _customerRepository.AddAsync(customer);
            await _unitOfWork.SaveChangesAsync();
            return customer;
        }

        public async Task<Customer> UpdateCustomerAsync(int id, Customer customer)
        {
            var existingCustomer = await _customerRepository.GetByIdAsync(id);
            if (existingCustomer == null)
                throw new KeyNotFoundException($"Customer with ID {id} not found.");

            // Check if phone number is being changed and if it's already in use
            if (existingCustomer.PhoneNumber != customer.PhoneNumber)
            {
                var customerWithPhone = await _customerRepository.GetCustomerByPhoneAsync(customer.PhoneNumber);
                if (customerWithPhone != null)
                    throw new InvalidOperationException("A customer with this phone number already exists.");
            }

            // Check if email is being changed and if it's already in use
            if (!string.IsNullOrEmpty(customer.Email) && existingCustomer.Email != customer.Email)
            {
                var customerWithEmail = await _customerRepository.GetCustomerByEmailAsync(customer.Email);
                if (customerWithEmail != null)
                    throw new InvalidOperationException("A customer with this email already exists.");
            }

            existingCustomer.FullName = customer.FullName;
            existingCustomer.PhoneNumber = customer.PhoneNumber;
            existingCustomer.Email = customer.Email;
            existingCustomer.Address = customer.Address;
            existingCustomer.UpdatedAt = DateTime.UtcNow;

            _customerRepository.Update(existingCustomer);
            await _unitOfWork.SaveChangesAsync();
            return existingCustomer;
        }

        public async Task<bool> DeleteCustomerAsync(int id)
        {
            var customer = await _customerRepository.GetByIdAsync(id);
            if (customer == null)
                return false;

            _customerRepository.Delete(customer);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
    }
} 