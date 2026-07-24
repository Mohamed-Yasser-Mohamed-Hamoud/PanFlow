using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PanFlow.API.Features.Auth.DTOs.Login;
using PanFlow.API.Features.Auth.DTOs.Register;
using PanFlow.API.Features.Auth.Services;


namespace PanFlow.API.Features.Auth.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _service;
        public AuthController(IAuthService service)
        {
            _service = service;
        }


        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var result = await _service.RegisterAsync(request);
            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }


        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var result = await _service.LoginAsync(request);
            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }
    }
}
