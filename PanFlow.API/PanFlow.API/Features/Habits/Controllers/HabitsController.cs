using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PanFlow.API.Features.Habits.DTOs.Create;
using PanFlow.API.Features.Habits.DTOs.Delete;
using PanFlow.API.Features.Habits.DTOs.Read;
using PanFlow.API.Features.Habits.DTOs.Restore;
using PanFlow.API.Features.Habits.DTOs.Update;
using PanFlow.API.Features.Habits.Services;
using PanFlow.API.Shared.Controller;

namespace PanFlow.API.Features.Habits.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class HabitsController : ApiBaseController
    {
        private readonly IHabitService _habitService;
        public HabitsController(IHabitService habitService)
        {
            _habitService = habitService;
        }


        [HttpPost("create")]
        public async Task<IActionResult> create([FromBody] CreateHabitRequest request)
        {
            var result = await _habitService.Create(request, CurrentUserId);
            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> deleteForever([FromBody] DeleteHabitRequest request)
        {
            var result = await _habitService.DeleteForEver(request, CurrentUserId);
            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }

        [HttpPut("delete")]
        public async Task<IActionResult> delete([FromBody] DeleteHabitRequest request)
        {
            var result = await _habitService.Delete(request, CurrentUserId);
            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }

        [HttpPut("restore")]
        public async Task<IActionResult> restore([FromBody] RestoreHabitRequest request)
        {
            var result = await _habitService.Restore(request, CurrentUserId);
            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }


        [HttpPut("update")]
        public async Task<IActionResult> update([FromBody] UpdateHabitRequest request)
        {
            var result = await _habitService.Update(request, CurrentUserId);
            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("read")]
        public async Task<IActionResult> read([FromQuery] ReadHabitRequest request)
        {
            var result = await _habitService.Read(request, CurrentUserId);
            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }


        [HttpGet("readAll")]
        public async Task<IActionResult> readAll()
        {
            var result = await _habitService.GetAllHabits(CurrentUserId);
            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }


        [HttpGet("aspectHabit")]
        public async Task<IActionResult> aspectHabit([FromQuery] ReadAspectHabitsRequest request)
        {
            var result = await _habitService.GetAspectHabits(request, CurrentUserId);
            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("deletedHabit")]
        public async Task<IActionResult> deletedHabit() 
        {
            var result = await _habitService.GetDeletedHabits(CurrentUserId);
            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }



    }
}
