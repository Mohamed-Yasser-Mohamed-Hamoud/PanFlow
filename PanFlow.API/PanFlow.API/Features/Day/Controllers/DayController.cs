using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PanFlow.API.Features.Day.DTOs.AddHabits;
using PanFlow.API.Features.Day.DTOs.Create;
using PanFlow.API.Features.Day.DTOs.Delete;
using PanFlow.API.Features.Day.DTOs.Read;
using PanFlow.API.Features.Day.DTOs.Restore;
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


        [HttpDelete("delete")]
        public async Task<IActionResult> deleteForever([FromBody] DeleteDayRequest request)
        {
            var result = await _dayService.DeleteForEver(request);
            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }


        [HttpPut("delete")]
        public async Task<IActionResult> delete([FromBody] DeleteDayRequest request)
        {
            var result = await _dayService.Delete(request);
            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }


        [HttpPut("restore")]
        public async Task<IActionResult> restore([FromBody] RestoreDayRequest request)
        {
            var result = await _dayService.Restore(request);
            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }


        [HttpPut("updateHabitStatus")]
        public async Task<IActionResult> updateHabitStatus([FromBody] UpdateDayHabitRequest request)
        {
            var result = await _dayService.UpdateHabitStatus(request);
            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }


        [HttpGet("read")]
        public async Task<IActionResult> read([FromQuery] ReadDayRequest request)
        {
            var result = await _dayService.Read(request);
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
        [HttpPost("addHabits")]
        public async Task<IActionResult> AddHabits([FromBody] AddHabitsToDayRequest request)
        {
            var result = await _dayService.AddHabits(request);

            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }



        [HttpDelete("removeHabit")]
        public async Task<IActionResult> RemoveHabit([FromBody] RemoveHabitFromDayRequest request)
        {
            var result = await _dayService.RemoveHabit(request);

            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }



        [HttpGet("deletedDay")]
        public async Task<IActionResult> deletedDay()
        {
            var result = await _dayService.GetDeletedDays(CurrentUserId);
            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }


    }
}
