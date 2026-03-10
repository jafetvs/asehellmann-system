using AsehellmannAppApi.Modelos.ModeloDto.UsuarioDtos;

namespace AsehellmannAppApi.Repositorio.IRepositorio
{
    public interface IManejoRoles
    {
        Task<bool> AsignarRolesAsync(Usuario usuario, IEnumerable<string> roles);
        Task<bool> QuitarRolesAsync(Usuario usuario, IEnumerable<string> roles);
        Task<MostrarTodoUsuarioDto> ObtenerUsuarioDtoConRolesAsync(string userId);
        Task<bool> verificarYCrearRolAsync(string roleName);

        Task<MostrarTodoUsuarioDto> ObtenerUsuarioDtoConRolesAsync(string userId, bool incluirRoles = true);
    }
}
