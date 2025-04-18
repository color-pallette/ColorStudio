using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly JwtTokenService _jwtTokenService;

    public AuthController(IUserService userService, JwtTokenService jwtTokenService)
    {
        _userService = userService;
        _jwtTokenService = jwtTokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterModel model)
    {
        var user = await _userService.RegisterAsync(model.FullName, model.Email, model.Password);
        return Ok(user);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginModel model)
    {
        var user = await _userService.AuthenticateAsync(model.Email, model.Password);
        if (user == null)
        {
            return Unauthorized("Invalid credentials.");
        }

        var token = _jwtTokenService.GenerateToken(user);
        return Ok(new { Token = token });
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordModel model)
    {
        var token = await _userService.GenerateResetTokenAsync(model.Email);
        // Implement email sending here
        return Ok(new { Token = token });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(ResetPasswordModel model)
    {
        var success = await _userService.ResetPasswordAsync(model.Email, model.Token, model.NewPassword);
        if (!success)
        {
            return BadRequest("Password reset failed.");
        }
        return Ok("Password has been reset.");
    }
}
