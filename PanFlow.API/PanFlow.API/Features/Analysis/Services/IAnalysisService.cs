using PanFlow.API.Features.Analysis.DTOs.Read;
using PanFlow.API.Shared.DTOs;

namespace PanFlow.API.Features.Analysis.Services
{
    public interface IAnalysisService
    {
        // Read
        public Task<GeneralResponseDto<ReadAnalysisResponse>> GetAnalysis(string userId);
    }
}
