using RailAdmin.API.DTOs.Request.User;
using RailAdmin.API.DTOs.Response;

namespace RailAdmin.API.Services.IService;

public interface IUserService
{
    Task<IEnumerable<UserResponse>> GetAllAsync();
    Task<UserResponse?> GetByIdAsync(int id);
    Task<UserResponse> CreateAsync(UserCreateRequest dto);
    Task<bool> UpdateAsync(int id, UserUpdateRequest dto);
    Task<bool> DeleteAsync(int id);
}