using PanFlow.API.Features.Users.DTOs.Read;
using PanFlow.API.Features.Users.DTOs.Update;
using PanFlow.API.Shared.DTOs;

namespace PanFlow.API.Features.Users.Services;

public interface IUserService
{
    Task<GeneralResponseDto<SelectedUserResponse>> ReadUserAsync(string userId);
    Task<GeneralResponseDto<object>> UpdateUserAsync(string userId, UpdateRequest updateRequest);
    Task<GeneralResponseDto<object>> UpdatePasswordAsync(string userId, UpdatePasswordRequest updateRequest);
    Task<GeneralResponseDto<object>> DeleteUserAsync(string userId);
}