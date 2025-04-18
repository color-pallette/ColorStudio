using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Security.Cryptography;
using System;
using System.Threading.Tasks;
using ColorStudio.DataAccess.Interface;
using ColorStudio.DataAccess.Interface.Entities;
using ColorStudio.DataAccess.Interface.Repositories;
using ColorStudio.DataService.Interface.Services;
using System.Text;

namespace ColorStudio.DataService.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;

        public UserService(IUserRepository userRepository, IUnitOfWork unitOfWork)
        {
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<User> CreateUserAsync(User user)
        {
            await _userRepository.AddAsync(user);
            await _unitOfWork.SaveChangesAsync();
            return user;
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _userRepository.FindByEmailAsync(email);
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _userRepository.GetByIdAsync(id);
        }

        public async Task<User> UpdateUserAsync(User user)
        {
            _userRepository.Update(user);
            await _unitOfWork.SaveChangesAsync();
            return user;
        }

        public async Task DeleteUserAsync(int id)
        {
            var user = await GetUserByIdAsync(id);
            if (user != null)
            {
                _userRepository.Delete(user);
                await _unitOfWork.SaveChangesAsync();
            }
        }

        public async Task<User?> AuthenticateAsync(string username, string password)
        {
            var user = await _userRepository.FindByUsernameAsync(username);
            if (user == null || !user.IsActive)
                return null;

            var passwordHash = HashPassword(password, user.Salt);
            if (passwordHash != user.PasswordHash)
                return null;

            user.LastLoginAt = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync();

            return user;
        }

        public async Task<User> RegisterAsync(string username, string email, string password)
        {
            if (await _userRepository.FindByEmailAsync(email) != null)
                throw new InvalidOperationException("Email already exists.");

            if (await _userRepository.FindByUsernameAsync(username) != null)
                throw new InvalidOperationException("Username already exists.");

            var salt = GenerateSalt();
            var passwordHash = HashPassword(password, salt);

            var user = new User
            {
                Username = username,
                Email = email,
                PasswordHash = passwordHash,
                Salt = salt,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            await _userRepository.AddAsync(user);
            await _unitOfWork.SaveChangesAsync();

            return user;
        }

        public async Task<bool> ChangePasswordAsync(long userId, string newPassword)
        {
            var user = await _userRepository.FindByIdAsync(userId);
            if (user == null)
            {
                throw new InvalidOperationException("User not found.");
            }

            user.PasswordHash = HashPassword(newPassword, user.Salt);
            _userRepository.Update(user);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<string> GenerateResetTokenAsync(string email)
        {
            var user = await _userRepository.FindByEmailAsync(email);
            if (user == null)
            {
                throw new InvalidOperationException("User not found.");
            }

            // Generate a simple token (can be improved with a proper token generation mechanism)
            return Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
        }

        public async Task<bool> ResetPasswordAsync(string email, string token, string newPassword)
        {
            // Token validation logic can be implemented here if needed
            var user = await _userRepository.FindByEmailAsync(email);
            if (user == null)
            {
                throw new InvalidOperationException("User not found.");
            }

            user.PasswordHash = HashPassword(newPassword, user.Salt);
            _userRepository.Update(user);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        private string GenerateSalt()
        {
            var salt = new byte[32];
            using (var rng = new RNGCryptoServiceProvider())
            {
                rng.GetBytes(salt);
            }
            return Convert.ToBase64String(salt);
        }

        private string HashPassword(string password, string salt)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password + salt));
                return Convert.ToBase64String(hashedBytes);
            }
        }
    }
}
