using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PanFlow.API.Features.Users.DTOs.Update;
using PanFlow.API.Features.Users.Services;
using PanFlow.API.Shared.Controller;
using System.Security.Claims;

namespace PanFlow.API.Features.Users.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize] // 👈 إجبارية عشان مفيش حد يوصل للبروفايل من غير توكن
public class UsersController : ApiBaseController
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    // 💡 ميثود مساعدة بتجيب الـ ID من التوكن عشان نضف الكود

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        if (string.IsNullOrEmpty(CurrentUserId)) return Unauthorized(new { message = "Invalid Token" });

        var result = await _userService.ReadUserAsync(CurrentUserId);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateRequest request)
    {
        if (string.IsNullOrEmpty(CurrentUserId)) return Unauthorized(new { message = "Invalid Token" });

        var result = await _userService.UpdateUserAsync(CurrentUserId, request);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpPut("profile/update-password")]
    public async Task<IActionResult> UpdatePassword([FromBody] UpdatePasswordRequest request)
    {
        if (string.IsNullOrEmpty(CurrentUserId)) return Unauthorized(new { message = "Invalid Token" });

        var result = await _userService.UpdatePasswordAsync(CurrentUserId, request);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("profile")]
    public async Task<IActionResult> DeleteUser()
    {
        if (string.IsNullOrEmpty(CurrentUserId)) return Unauthorized(new { message = "Invalid Token" });

        var result = await _userService.DeleteUserAsync(CurrentUserId);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }
}