
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using AsehellmannAppApi.Modelos.ModeloDto.AhorrosDtos;

namespace AsehellmannAppApi.Modelos.ModeloDto.RegistroPagoAhorroDto
{
    public class MostrarRegistroPagoAhorroDto
    {
        public MostrarAhorroDto mostrarAhorro { get; set; }
        //public int idAhorro { get; set; }
        //public Usuario usuario { get; set; }
        public DateTime fechaRegistro { get; set; }
        public int montoAhorroRegistrado { get; set; }

      
    }
}
