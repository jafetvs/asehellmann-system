using AsehellmannAppApi.Modelos.ModeloDto.UsuarioDtos;
using System.ComponentModel.DataAnnotations.Schema;

namespace AsehellmannAppApi.Modelos.ModeloDto.AhorrosDtos
{
    public class AhorroDto
    {
        public MostrarTodoUsuarioDto Usuario { get; set; }
        public int idAhorro { get; set; }
        public string tipoAhorro { get; set; }
        public int montoDebitar { get; set; }
        public DateTime fechaInicio { get; set; }
        public DateTime fechaFin { get; set; }
        public string UsuarioId { get; set; }
        public string status { get; set; }
    }
}
