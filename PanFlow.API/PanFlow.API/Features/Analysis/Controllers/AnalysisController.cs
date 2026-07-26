using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PanFlow.API.Features.Analysis.Services;
using PanFlow.API.Shared.Controller;

namespace PanFlow.API.Features.Analysis.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AnalysisController : ApiBaseController
    {
        private readonly IAnalysisService _analysisService;
        public AnalysisController(IAnalysisService analysisService)
        {
            _analysisService = analysisService;
        }


        [HttpGet("read")]
        public async Task<IActionResult> read()
        {
            var result = await _analysisService.GetAnalysis(CurrentUserId);
            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }


    }
}
