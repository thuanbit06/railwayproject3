using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using RailAdmin.API.Data;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// =========================================================
// DATABASE
// =========================================================

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("Default")
    )
);

// =========================================================
// CONTROLLERS
// =========================================================

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

// =========================================================
// SWAGGER
// =========================================================

builder.Services.AddSwaggerGen(options =>
{
    // Swagger document
    options.SwaggerDoc(
        "v1",
        new OpenApiInfo
        {
            Title = "RailAdmin API",
            Version = "v1",
            Description = "Railway Management System API"
        }
    );

    // JWT Bearer
    options.AddSecurityDefinition(
        "Bearer",
        new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description = "Enter JWT token. Example: Bearer {token}"
        }
    );

    // JWT Security Requirement
    options.AddSecurityRequirement(
        document => new OpenApiSecurityRequirement
        {
            [new OpenApiSecuritySchemeReference("Bearer", document)] = []
        }
    );
});

// =========================================================
// JWT AUTHENTICATION
// =========================================================

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidIssuer =
                    builder.Configuration["Jwt:Issuer"],

                ValidAudience =
                    builder.Configuration["Jwt:Audience"],

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(
                            builder.Configuration["Jwt:Key"]!
                        )
                    )
            };
    });

// =========================================================
// AUTHORIZATION
// =========================================================

builder.Services.AddAuthorization();

// =========================================================
// CORS
// =========================================================

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "http://localhost:5175"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();


// =========================================================
// BUILD APP
// =========================================================



// =========================================================
// MIDDLEWARE
// =========================================================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider
        .GetRequiredService<AppDbContext>();

    await AdminSeeder.SeedAdminAsync(
        db,
        app.Configuration);
}

app.Run();