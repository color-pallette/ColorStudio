using ColorStudio.DataAccess.Interface.Entities;

public interface IUserService
{
    Task<User?> AuthenticateAsync(string email, string password);
    Task<User> RegisterAsync(string fullName, string email, string password);
    Task<bool> ChangePasswordAsync(long userId, string newPassword);
    Task<string> GenerateResetTokenAsync(string email);
    Task<bool> ResetPasswordAsync(string email, string token, string newPassword);
}
