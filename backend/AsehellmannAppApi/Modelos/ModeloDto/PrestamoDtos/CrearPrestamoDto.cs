using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace AsehellmannAppApi.Modelos.ModeloDto.PrestamoDtos
{
    public class CrearPrestamoDto
    {
        public string cedula { get; set; }
        public string tipoPrestamo { get; set; }
        public int montoPrestamo { get; set; }
        public int plazoPrestamo { get; set; }

    }
}
