using PanFlow.API.Features.Aspects.DTOs.Create;
using PanFlow.API.Features.Habits.DTOs.Create;
using PanFlow.API.Features.Habits.DTOs.Delete;
using PanFlow.API.Features.Habits.DTOs.Read;
using PanFlow.API.Features.Habits.DTOs.Restore;
using PanFlow.API.Features.Habits.DTOs.Update;
using PanFlow.API.Shared.DTOs;

namespace PanFlow.API.Features.Habits.Services
{
    public interface IHabitService
    {
        public Task<GeneralResponseDto<CreateHabitResponse>> Create(CreateHabitRequest request, string userId);

        public Task<GeneralResponseDto<ReadHabitResponse>> Read(ReadHabitRequest request, string userId);
        public Task<GeneralResponseDto<ReadAllHabitResponse>> GetAllHabits(string userId);
        public Task<GeneralResponseDto<ReadAllHabitResponse>> GetAspectHabits(ReadAspectHabitsRequest request, string userId);
        public Task<GeneralResponseDto<ReadAllHabitResponse>> GetDeletedHabits(string userId);

        public Task<GeneralResponseDto<object>> Update(UpdateHabitRequest request, string userId);

        public Task<GeneralResponseDto<object>> Delete(DeleteHabitRequest request, string userId);
        public Task<GeneralResponseDto<object>> DeleteForEver(DeleteHabitRequest request, string userId);

        public Task<GeneralResponseDto<object>> Restore(RestoreHabitRequest request, string userId);
    }
}