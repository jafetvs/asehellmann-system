using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using AsehellmannAppApi.Modelos.ModeloDto.UsuarioDtos;

namespace AsehellmannAppApi.Modelos.ModeloDto.PrestamoDtos
{
    public class PrestamoDto
    {
        public UsuarioDatosDto Usuario { get; set; }
        public int idPrestamo { get; set; }
        public string tipoPrestamo { get; set; }
        public int montoPrestamo { get; set; }
        public float intereses { get; set; }
        public int plazoPrestamo { get; set; }
        public int plazoRealizado { get; set; }
        public int saldoPrestamo { get; set; }
        public float cuotaAPagar { get; set; }
        public float saldoFinal {  get; set; }
        public float totalMontoPagar { get; set; }
        public DateTime fechaSolicitud { get; set; }
        public string status { get; set; }
        public string UsuarioId { get; set; }  //Validar si es necesario este atributo
    }
}
