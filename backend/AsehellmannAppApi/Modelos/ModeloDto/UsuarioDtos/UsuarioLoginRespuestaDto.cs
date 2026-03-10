using AsehellmannAppApi.Modelos.ModeloDto.UsuarioDtos;

namespace AsehellmannAppApi.Modelos.ModeloDto
{
    public class UsuarioLoginRespuestaDto
    {
        public MostrarTodoUsuarioDto Usuario { get; set; }
        public string Token { get; set; }
    }
}
