using PanFlow.API.Features.Auth.DTOs;
using PanFlow.API.Features.Auth.DTOs.Login;
using PanFlow.API.Features.Auth.DTOs.Register;
using PanFlow.API.Shared.DTOs;

namespace PanFlow.API.Features.Auth.Services
{
    public interface IAuthService
    {
        public Task<GeneralResponseDto<AuthResponse>> RegisterAsync(RegisterRequest request);
        public Task<GeneralResponseDto<AuthResponse>> LoginAsync(LoginRequest request);
    }
}
