using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using PanFlow.API.Data;
using PanFlow.API.Features.Aspects.Services;
using PanFlow.API.Features.Auth.Services;
using PanFlow.API.Features.Day.Services;
using PanFlow.API.Features.Habits.Services;
using PanFlow.API.Features.Users.Services;
using PanFlow.API.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ==========================================
// 1. Add Controllers
// ==========================================
builder.Services.AddControllers();

// ==========================================
// 2. Add Swagger
// ==========================================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    // ✅ تعريف نوع الـ Security (نفس الطريقة القديمة، بس namespace اتغير)
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter your JWT token — Swagger will add 'Bearer ' automatically"
    });

    // ✅ الطريقة الجديدة في v10 — بتاخد Func<OpenApiDocument, OpenApiSecurityRequirement>
    options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecuritySchemeReference("Bearer", document),
            new List<string>()
        }
    });
});
// ==========================================
// 3. Add CORS
// ==========================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// ==========================================
// 4. Add DbContext
// ==========================================
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// ==========================================
// 5. Add Identity
// ==========================================
builder.Services.AddIdentity<User, IdentityRole>(options => {
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 3;
    options.Password.RequiredUniqueChars = 0;

    options.User.RequireUniqueEmail = true;
})
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

// ==========================================
// 6. Add JWT Authentication
// ==========================================
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JWT:ValidIssuer"],
        ValidAudience = builder.Configuration["JWT:ValidAudience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["JWT:Secret"])
        )
    };
});

// ==========================================
// 7. Register Services
// ==========================================
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService , UserService>();
builder.Services.AddScoped<IAspectService, AspectService>();
builder.Services.AddScoped<IHabitService, HabitService>();
builder.Services.AddScoped<IDayService, DayService>();

var app = builder.Build();

// ==========================================
// Configure pipeline (الترتيب مهم جداً)
// ==========================================

// ✅ 1. Swagger (أول حاجة)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
// ✅ 2. CORS
app.UseCors("AllowAngular");

// ✅ 3. HTTPS Redirection
app.UseHttpsRedirection();


// ✅ 4. Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// ✅ 5. Controllers
app.MapControllers();

app.Run();