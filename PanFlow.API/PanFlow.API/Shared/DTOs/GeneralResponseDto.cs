using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PanFlow.API.Shared.DTOs;

public record GeneralResponseDto<T>
{
    [Required]
    [JsonPropertyName("isSuccess")]
    public bool IsSuccess { get; init; } // 👈 استخدمنا init بدل set عشان الـ Immutability

    [Required]
    [JsonPropertyName("message")]
    public string Message { get; init; } = string.Empty;

    [JsonPropertyName("data")]
    public T? Data { get; init; }

    // 💡 الـ Static Factories المريحة بتاعتك شغالة زي ما هي بالملي
    public static GeneralResponseDto<T> Success(string message, T data) =>
        new() { IsSuccess = true, Message = message, Data = data };

    public static GeneralResponseDto<T> Success(string message) =>
        new() { IsSuccess = true, Message = message, Data = default };

    public static GeneralResponseDto<T> Failure(string message) =>
        new() { IsSuccess = false, Message = message, Data = default };
}