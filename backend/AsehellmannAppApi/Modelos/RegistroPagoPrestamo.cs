using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace AsehellmannAppApi.Modelos
{
    public class RegistroPagoPrestamo
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int idRegistroPagoPrestamo { get; set; }

        public DateTime fechaRegistro { get; set; }

        public float montoPrestamoRegistrado { get; set; }
        public float montoPagoExtraOrdinario {get; set;}

        [ForeignKey("Prestamo")]
        public int idPrestamo { get; set; }

        public Prestamo Prestamo { get; set; }
    }
}
