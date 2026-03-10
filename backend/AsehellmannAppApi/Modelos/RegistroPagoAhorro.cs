using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace AsehellmannAppApi.Modelos
{
    public class RegistroPagoAhorro
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int idRegistroPagoAhorro { get; set; }

        public DateTime fechaRegistro { get; set; }

        public int montoAhorroRegistrado { get; set; }

        [ForeignKey("Ahorro")]
        public int idAhorro { get; set; }

        public Ahorro Ahorro { get; set; }
    }
}
