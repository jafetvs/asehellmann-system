
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using AsehellmannAppApi.Modelos.ModeloDto.AhorrosDtos;
using AsehellmannAppApi.Modelos.ModeloDto.PrestamoDtos;

namespace AsehellmannAppApi.Modelos.ModeloDto.RegistroPagoPrestamoDto
{
    public class MostrarRegistroPagoPrestamoDto
    {
        public MostrarPrestamoDto mostrarPrestamo { get; set; }
        //public int idAhorro { get; set; }
        //public Usuario usuario { get; set; }
        public DateTime fechaRegistro { get; set; }
        public float montoPrestamoRegistrado { get; set; }


    }
}
