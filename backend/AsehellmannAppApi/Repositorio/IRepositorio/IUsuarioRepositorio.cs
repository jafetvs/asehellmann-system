using AsehellmannAppApi.Modelos.ModeloDto;
using AsehellmannAppApi.Modelos.ModeloDto.UsuarioDtos;

namespace AsehellmannAppApi.Repositorio.IRepositorio
{
    public interface IUsuarioRepositorio
    {
        IEnumerable<Usuario> getUsuarios();
        Usuario getUsuario(string cedula);

        bool setStatus(Usuario usuario, string status);

        bool crearUsuario(Usuario usuario);

        bool ActualizarUsuario(string cedula, UsuarioActualizarDto usuarioDto);
        bool isUniqueUser(string cedula);

        bool existeUsuario(string cedula);

        bool guardar();
        Task<UsuarioLoginRespuestaDto> login(UsuarioLoginDto usuarioLoginDto);
        Task<MostrarTodoUsuarioDto> registro(UsuarioRegistroDto usuarioRegistroDto);
    }
}
