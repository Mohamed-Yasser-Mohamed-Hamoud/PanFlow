using PanFlow.API.Features.Day.DTOs.AddHabits;
using PanFlow.API.Features.Day.DTOs.Create;
using PanFlow.API.Features.Day.DTOs.Delete;
using PanFlow.API.Features.Day.DTOs.Read;
using PanFlow.API.Features.Day.DTOs.Restore;
using PanFlow.API.Features.Day.DTOs.Update;
using PanFlow.API.Shared.DTOs;

namespace PanFlow.API.Features.Day.Services
{
    public interface IDayService
    {
        // create Day
        public Task<GeneralResponseDto<CreateDayResponse>> Create(CreateDayRequest request, string userId);

        public Task<GeneralResponseDto<object>> RemoveHabit(RemoveHabitFromDayRequest request);
        // Read
        public Task<GeneralResponseDto<ReadDayResponse>> Read(ReadDayRequest request);
        public Task<GeneralResponseDto<ReadAllDayResponse>> GetAllDays(string userId);
        public Task<GeneralResponseDto<ReadAllDayResponse>> GetDeletedDays(string userId);
        public Task<GeneralResponseDto<ReadDayResponse>> GetToday(string userId);


        // update DayHabit (تيك/إلغاء تيك عادة جوه يوم معين)
        public Task<GeneralResponseDto<object>> UpdateHabitStatus(UpdateDayHabitRequest request);
        Task<GeneralResponseDto<AddHabitsToDayResponse>> AddHabits(AddHabitsToDayRequest request);

        // Delete Day
        public Task<GeneralResponseDto<object>> Delete(DeleteDayRequest request);
        public Task<GeneralResponseDto<object>> DeleteForEver(DeleteDayRequest request);


        // Restore Day
        public Task<GeneralResponseDto<object>> Restore(RestoreDayRequest request);


    }
}
