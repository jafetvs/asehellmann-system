using System.ComponentModel.DataAnnotations.Schema;

namespace AsehellmannAppApi.Modelos.ModeloDto.AhorrosDtos
{
    public class CrearAhorroDto
    {
        public string cedula { get; set; }
        public string tipoAhorro { get; set; } //SOLO navidad O cuestaEnero
        public int montoDebitar { get; set; }
        public DateTime fechaInicio { get; set; }
      
    }
}
