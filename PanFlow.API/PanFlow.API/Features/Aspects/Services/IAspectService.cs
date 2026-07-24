using PanFlow.API.Features.Aspects.DTOs.Create;
using PanFlow.API.Features.Aspects.DTOs.Delete;
using PanFlow.API.Features.Aspects.DTOs.Read;
using PanFlow.API.Features.Aspects.DTOs.Restore;
using PanFlow.API.Features.Aspects.DTOs.Update;
using PanFlow.API.Shared.DTOs;

namespace PanFlow.API.Features.Aspects.Services;

public interface IAspectService
{
    public Task<GeneralResponseDto<CreateAspectResponse>> CreateAspectAsync(CreateAspectRequest request, string userId);

    public Task<GeneralResponseDto<ReadAspectResponse>> ReadAspectAsync(ReadAspectRequest request, string userId);

    public Task<GeneralResponseDto<GetAllAspectsResponse>> GetAllAspectsAsync(string userId);
    public Task<GeneralResponseDto<GetAllAspectsResponse>> GetAllDeletedAspectsAsync(string userId);


    public Task<GeneralResponseDto<object>> UpdateAspectAsync(UpdateAspectRequest request, string userId);

    public Task<GeneralResponseDto<object>> DeleteAspectAsync(DeleteAspectRequest request, string userId);

    public Task<GeneralResponseDto<object>> RestoreAspectAsync(RestoreAspectRequest request, string userId);
    public Task<GeneralResponseDto<object>> DeleteAspectForEverAsync(DeleteAspectRequest request , string userId);
}