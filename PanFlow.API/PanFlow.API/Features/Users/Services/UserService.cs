using Microsoft.AspNetCore.Identity;
using PanFlow.API.Data;
using PanFlow.API.Features.Users.DTOs.Read;
using PanFlow.API.Features.Users.DTOs.Update;
using PanFlow.API.Models;
using PanFlow.API.Shared.DTOs;
using Microsoft.EntityFrameworkCore;
using PanFlow.API.Features.Users.DTOs.Delete;

namespace PanFlow.API.Features.Users.Services;

public class UserService : IUserService
{
    private readonly UserManager<User> _userManager;
    private readonly AppDbContext _context;

    public UserService(UserManager<User> userManager, AppDbContext context)
    {
        _userManager = userManager;
        _context = context;
    }

    // 1️⃣ جلب بيانات المستخدم
    public async Task<GeneralResponseDto<SelectedUserResponse>> ReadUserAsync(string userId)
    {
        if (string.IsNullOrEmpty(userId))
        {
            return GeneralResponseDto<SelectedUserResponse>.Failure("User ID can't be empty");
        }

        // 🚀 بيكلم الـ UserManager بالـ string بتاعه علطول بدون .ToString()
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return GeneralResponseDto<SelectedUserResponse>.Failure("User not found");
        }

        // 🚀 باصينا الـ user.Id الصافي كـ string للـ Record بدون Guid.Parse
        var userData = new SelectedUserResponse
        {
            UserName = user.UserName!,
            Email = user.Email!
        };

        return GeneralResponseDto<SelectedUserResponse>.Success("User retrieved successfully", userData);
    }

    // 2️⃣ تعديل بيانات المستخدم (Optional Update متاح بسلاسة)
    public async Task<GeneralResponseDto<object>> UpdateUserAsync(string userId, UpdateRequest updateRequest)
    {
        if (string.IsNullOrEmpty(userId))
        {
            return GeneralResponseDto<object>.Failure("User ID can't be empty");
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return GeneralResponseDto<object>.Failure("User not found");
        }

        // تحديث الـ Email لو مبعوت وقيمته متغيرة ومستعملش قبل كدة
        if (!string.IsNullOrEmpty(updateRequest.Email) && updateRequest.Email != user.Email)
        {
            var emailExist = await _userManager.FindByEmailAsync(updateRequest.Email);
            if (emailExist != null && emailExist.Id != user.Id)
            {
                return GeneralResponseDto<object>.Failure("Email is already used");
            }
            user.Email = updateRequest.Email;
        }

        // تحديث الـ UserName لو مبعوت وقيمته متغيرة ومستعملش قبل كدة
        if (!string.IsNullOrEmpty(updateRequest.UserName) && updateRequest.UserName != user.UserName)
        {
            var userNameExist = await _userManager.FindByNameAsync(updateRequest.UserName);
            if (userNameExist != null && userNameExist.Id != user.Id)
            {
                return GeneralResponseDto<object>.Failure("User name is already used");
            }
            user.UserName = updateRequest.UserName;
        }

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            return GeneralResponseDto<object>.Failure("Failed to update user: " + string.Join(", ", result.Errors.Select(e => e.Description)));
        }

        return GeneralResponseDto<object>.Success("User updated successfully");
    }

    // 3️⃣ تعديل الرقم السري
    public async Task<GeneralResponseDto<object>> UpdatePasswordAsync(string userId, UpdatePasswordRequest updateRequest)
    {
        if (string.IsNullOrEmpty(userId))
        {
            return GeneralResponseDto<object>.Failure("User ID can't be empty");
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return GeneralResponseDto<object>.Failure("User not found");
        }

        var isPasswordValid = await _userManager.CheckPasswordAsync(user, updateRequest.CurrentPassword);
        if (!isPasswordValid)
        {
            return GeneralResponseDto<object>.Failure("Current password is incorrect");
        }

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        var result = await _userManager.ResetPasswordAsync(user, token, updateRequest.NewPassword);

        if (!result.Succeeded)
        {
            return GeneralResponseDto<object>.Failure("Failed to update password: " + string.Join(", ", result.Errors.Select(e => e.Description)));
        }

        return GeneralResponseDto<object>.Success("Password updated successfully");
    }

    // 4️⃣ حذف المستخدم (Danger Zone)
    public async Task<GeneralResponseDto<object>> DeleteUserAsync(string userId , DeleteUserRequest request)
    {
        if (string.IsNullOrEmpty(userId))
            return GeneralResponseDto<object>.Failure("User ID can't be empty");

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return GeneralResponseDto<object>.Failure("User not found");

        var isCorrect = await _userManager.CheckPasswordAsync(user, request.Password);

        if (!isCorrect)
        {
            return  GeneralResponseDto<object>.Failure("Incorrect password.");
        }

        // احذف الحساب


        // حذف DayHabits الخاصة بأيام المستخدم
        var dayHabits = await _context.DayHabits
            .Where(dh => dh.Day.UserId == userId)
            .ToListAsync();

        _context.DayHabits.RemoveRange(dayHabits);

        // حذف الأيام
        var days = await _context.Days
            .Where(d => d.UserId == userId)
            .ToListAsync();

        _context.Days.RemoveRange(days);

        // حذف العادات
        var habits = await _context.Habits
            .Where(h => h.Aspect.UserId == userId)
            .ToListAsync();

        _context.Habits.RemoveRange(habits);

        // حذف الجوانب
        var aspects = await _context.Aspects
            .Where(a => a.UserId == userId)
            .ToListAsync();

        _context.Aspects.RemoveRange(aspects);

        await _context.SaveChangesAsync();

        var result = await _userManager.DeleteAsync(user);

        if (!result.Succeeded)
        {
            return GeneralResponseDto<object>.Failure(
                string.Join(", ", result.Errors.Select(e => e.Description)));
        }

        return GeneralResponseDto<object>.Success("User deleted successfully");
    }
}