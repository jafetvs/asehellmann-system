using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace AsehellmannAppApi.Modelos.ModeloDto.PrestamoDtos
{
    public class SolicitudPrestamoDto
    {
        public double MontoPrestamo { get; set; }
        public int PlazoPrestamo { get; set; }

    }
}
