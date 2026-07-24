using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using PanFlow.API.Features.Auth.DTOs;
using PanFlow.API.Features.Auth.DTOs.Login;
using PanFlow.API.Features.Auth.DTOs.Register;
using PanFlow.API.Models;
using PanFlow.API.Shared.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PanFlow.API.Features.Auth.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly IConfiguration _configuration;

    public AuthService(UserManager<User> userManager, SignInManager<User> signInManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
    }

    // 1️⃣ ميثود الـ Login
    public async Task<GeneralResponseDto<AuthResponse>> LoginAsync(LoginRequest request)
    {
        var exist = await _userManager.FindByEmailAsync(request.Email);
        if (exist == null)
        {
            return GeneralResponseDto<AuthResponse>.Failure("User does not exist");
        }

        var result = await _signInManager.CheckPasswordSignInAsync(exist, request.Password, false);
        if (!result.Succeeded)
        {
            return GeneralResponseDto<AuthResponse>.Failure("Invalid password");
        }

        var token = GenerateToken(exist);

        // 🚀 التعديل هنا: باصينا الـ token جوه القوسين علطول لإن AuthResponse بقى Record
        var authResponse = new AuthResponse
        {
            Token = token
        };

        return GeneralResponseDto<AuthResponse>.Success("User logged in successfully", authResponse);
    }

    // 2️⃣ ميثود الـ Register
    public async Task<GeneralResponseDto<AuthResponse>> RegisterAsync(RegisterRequest request)
    {
        var exist = await _userManager.FindByEmailAsync(request.Email);
        if (exist != null)
        {
            return GeneralResponseDto<AuthResponse>.Failure("Email already exists");
        }

        var existUser = await _userManager.FindByNameAsync(request.UserName);
        if (existUser != null)
        {
            return GeneralResponseDto<AuthResponse>.Failure("Username already exists");
        }

        var user = new User
        {
            UserName = request.UserName,
            Email = request.Email
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            return GeneralResponseDto<AuthResponse>.Failure("User registration failed");
        }

        var token = GenerateToken(user);

        // 🚀 التعديل هنا برضه عشان يطابق الـ Record Syntax
        var authResponse = new AuthResponse{
            Token = token
        };

        return GeneralResponseDto<AuthResponse>.Success("User registered successfully", authResponse);
    }

    public string GenerateToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email!),
            new Claim(ClaimTypes.Name, user.UserName!)
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["JWT:ValidIssuer"],
            audience: _configuration["JWT:ValidAudience"],
            claims: claims,
            signingCredentials: creds,
            expires: DateTime.Now.AddDays(7)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}