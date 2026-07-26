using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PanFlow.API.Features.Day.DTOs.AddHabits;
using PanFlow.API.Features.Day.DTOs.Create;
using PanFlow.API.Features.Day.DTOs.Read;
using PanFlow.API.Features.Day.DTOs.Update;
using PanFlow.API.Features.Day.Services;
using PanFlow.API.Shared.Controller;

namespace PanFlow.API.Features.Day.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DayController : ApiBaseController
    {
        private readonly IDayService _dayService;
        public DayController(IDayService dayService)
        {
            _dayService = dayService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> create([FromBody] CreateDayRequest request)
        {
            var result = await _dayService.Create(request, CurrentUserId);
            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpPost("addHabitsToDay")]
        public async Task<IActionResult> addHabitsToDay([FromBody] AddHabitsToDayRequest request)
        {
            var result = await _dayService.AddHabitsToDay(request, CurrentUserId);
            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpGet("today")]
        public async Task<IActionResult> today()
        {
            var result = await _dayService.GetToday(CurrentUserId);
            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpPut("updateHabitStatus")]
        public async Task<IActionResult> updateHabitStatus([FromBody] UpdateHabitDayRequest request)
        {
            var result = await _dayService.UpdateHabitStatus(request, CurrentUserId);
            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpGet("read")]
        public async Task<IActionResult> read([FromQuery] ReadDayRequest request)
        {
            var result = await _dayService.Read(request, CurrentUserId);
            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpGet("readAll")]
        public async Task<IActionResult> readAll()
        {
            var result = await _dayService.GetAllDays(CurrentUserId);
            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> delete([FromQuery] string dayId)
        {
            var result = await _dayService.Delete(dayId, CurrentUserId);
            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpPost("restore")]
        public async Task<IActionResult> restore([FromBody] RestoreDayRequest request)
        {
            var result = await _dayService.Restore(request.DayId, CurrentUserId);
            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpDelete("removeHabitFromDay")]
        public async Task<IActionResult> removeHabitFromDay([FromQuery] string dayId, [FromQuery] string habitId)
        {
            var result = await _dayService.RemoveHabitFromDay(dayId, habitId, CurrentUserId);
            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpPut("reorderHabits")]
        public async Task<IActionResult> reorderHabits([FromBody] ReorderHabitsRequest request)
        {
            var result = await _dayService.ReorderHabits(request.DayId, request.HabitIds, CurrentUserId);
            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }
    }

    public class RestoreDayRequest
    {
        public string DayId { get; set; }
    }

    public class ReorderHabitsRequest
    {
        public string DayId { get; set; }
        public List<string> HabitIds { get; set; }
    }
}
