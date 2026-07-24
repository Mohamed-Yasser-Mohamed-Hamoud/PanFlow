using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PanFlow.API.Features.Aspects.DTOs.Create;
using PanFlow.API.Features.Aspects.DTOs.Delete;
using PanFlow.API.Features.Aspects.DTOs.Read;
using PanFlow.API.Features.Aspects.DTOs.Restore;
using PanFlow.API.Features.Aspects.DTOs.Update;
using PanFlow.API.Features.Aspects.Services;
using PanFlow.API.Shared.Controller;

namespace PanFlow.API.Features.Aspects.Controllers
{
    [Authorize]  
    [Route("api/[controller]")]
    public class AspectsController : ApiBaseController // 👈 ورثنا الـ Base هنا
    {
        private readonly IAspectService _aspectService;

        public AspectsController(IAspectService aspectService)
        {
            _aspectService = aspectService;
        }

        // 1️⃣ إنشاء Aspect جديد
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateAspectRequest request)
        {
            var result = await _aspectService.CreateAspectAsync(request, CurrentUserId);
            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }

        // 2️⃣ جلب Aspect واحد محدد
        [HttpGet("get")]
        public async Task<IActionResult> GetById([FromQuery] ReadAspectRequest request)
        {
            var result = await _aspectService.ReadAspectAsync(request, CurrentUserId);
            if (!result.IsSuccess) return NotFound(result);
            return Ok(result);
        }

        // 3️⃣ جلب كل الـ Aspects الخاصة باليوزر الحالي
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _aspectService.GetAllAspectsAsync(CurrentUserId);
            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }


        [HttpGet("get-deleted")]
        public async Task<IActionResult> GetDeleted()
        {
            var result = await _aspectService.GetAllDeletedAspectsAsync(CurrentUserId);
            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }




        // 4️⃣ تحديث بيانات Aspect
        [HttpPut("update")]
        public async Task<IActionResult> Update([FromBody] UpdateAspectRequest request)
        {
            var result = await _aspectService.UpdateAspectAsync(request, CurrentUserId);
            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }

        // 5️⃣ مسح Aspect (Soft Delete)
        [HttpPut("delete")]
        public async Task<IActionResult> Delete([FromBody] DeleteAspectRequest request)
        {
            var result = await _aspectService.DeleteAspectAsync(request, CurrentUserId);
            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }

        // 6️⃣ استعادة Aspect ممسوح
        [HttpPut("restore")]
        public async Task<IActionResult> Restore([FromBody] RestoreAspectRequest request)
        {
            var result = await _aspectService.RestoreAspectAsync(request, CurrentUserId);
            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteForEver([FromBody] DeleteAspectRequest request) 
        {
            var result = await _aspectService.DeleteAspectForEverAsync(request, CurrentUserId);
            if(!result.IsSuccess)return BadRequest(result);
            return Ok(result);
        }
    }
}
