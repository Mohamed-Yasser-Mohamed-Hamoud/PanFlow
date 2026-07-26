using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using PanFlow.API.Features.Day.DTOs.Read;

namespace PanFlow.API.Features.Day.DTOs.AddHabits
{
    public record AddHabitsToDayResponse
    {
        [Required]
        [JsonPropertyName("addedHabits")]
        public required List<ReadHabitDayResponse> AddedHabits { get; set; }
    }
}
