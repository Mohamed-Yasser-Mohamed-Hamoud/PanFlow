using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

public record ReadHabitResponse
{
    [Required]
    [JsonPropertyName("habitName")]
    public required string HabitName { get; set; }

    [Required]
    [JsonPropertyName("habitId")]
    public required string HabitId { get; set; }

    [Required]
    [JsonPropertyName("aspectId")]
    public required string AspectId { get; set; }

    [Required]
    [JsonPropertyName("habitColor")]
    public required string HabitColor { get; set; }
}