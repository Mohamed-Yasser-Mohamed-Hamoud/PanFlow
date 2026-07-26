using PanFlow.API.Features.Day.DTOs.AddHabits;
using PanFlow.API.Features.Day.DTOs.Create;
using PanFlow.API.Features.Day.DTOs.Read;
using PanFlow.API.Features.Day.DTOs.Update;
using PanFlow.API.Shared.DTOs;

namespace PanFlow.API.Features.Day.Services
{
    public interface IDayService
    {
        // create Day (ممكن يتعمل بعادات مبدئية، أو فاضي وتتضاف العادات بعدين)
        public Task<GeneralResponseDto<CreateDayResponse>> Create(CreateDayRequest request, string userId);


        // إضافة عادات لليوم بعد إنشائه
        public Task<GeneralResponseDto<AddHabitsToDayResponse>> AddHabitsToDay(AddHabitsToDayRequest request, string userId);


        // Read
        public Task<GeneralResponseDto<ReadDayResponse>> Read(ReadDayRequest request, string userId);
        public Task<GeneralResponseDto<ReadAllDayResponse>> GetAllDays(string userId);
        public Task<GeneralResponseDto<ReadDayResponse>> GetToday(string userId);


        // update Habit status inside a Day
        public Task<GeneralResponseDto<object>> UpdateHabitStatus(UpdateHabitDayRequest request, string userId);


        // ملحوظة: Delete / Restore / DeleteForEver / GetDeletedDays اتشالوا بالكامل
        // لأن Day مفيهوش IsDeleted, واتفقنا نلغي فكرة الـ soft-delete للـ Day خالص
    }
}
