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
        // create Habit
                public Task<GeneralResponseDto<CreateHabitResponse>> Create(CreateHabitRequest request);


        //Read 
            public Task<GeneralResponseDto<ReadHabitResponse>> Read(ReadHabitRequest request);
            public Task<GeneralResponseDto<ReadAllHabitResponse>> GetAllHabits(string userId);
        public Task<GeneralResponseDto<ReadAllHabitResponse>> GetAspectHabits(ReadAspectHabitsRequest request);
        public Task<GeneralResponseDto<ReadAllHabitResponse>> GetDeletedHabits(string userId);


        // update Habit
        public Task<GeneralResponseDto<object>> Update(UpdateHabitRequest request);


        // Delete Habit
        public Task<GeneralResponseDto<object>> Delete(DeleteHabitRequest request);
        public Task<GeneralResponseDto<object>> DeleteForEver(DeleteHabitRequest request);


        //Restore Habit 
        public Task<GeneralResponseDto<object>> Restore(RestoreHabitRequest request);





    }
}
