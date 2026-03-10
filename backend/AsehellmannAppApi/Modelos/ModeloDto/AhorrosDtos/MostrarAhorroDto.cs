using AsehellmannAppApi.Modelos.ModeloDto.UsuarioDtos;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AsehellmannAppApi.Modelos.ModeloDto.AhorrosDtos
{
    public class MostrarAhorroDto
    {
        public UsuarioDatosDto Usuario { get; set; }
        public int id { get; set; }
        public string tipoAhorro { get; set; }
        public int montoDebitar { get; set; }
        public string fechaInicioFormateada { get; set; }
        public string fechaFinFormateada { get; set; }
        public string UsuarioId { get; set; }
        public string status { get; set; }
    }
}
