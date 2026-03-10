using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AsehellmannAppApi.Modelos
{
    public class RegistroPagoFeria
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int FeriaProveedorId { get; set; }

        [Required]
        public float montoCompra { get; set; }

        public float pagoRealizado { get; set; }
        public float montoPagarMes { get; set; }
        public int plazo { get; set; }
        public int plazoRealizado { get; set; }

        [Required]
        [ForeignKey("Usuario")]
        public string UsuarioCedula { get; set; }

        public virtual Usuario Usuario { get; set; }
        public virtual FeriaProveedor FeriaProveedor { get; set; }

        public DateTime FechaCompra { get; set; }

        public RegistroPagoFeria()
        {
            montoPagarMes = CalcularMontoPagarMes();
        }

        private float CalcularMontoPagarMes()
        {
            return plazo > 0 ? montoCompra / plazo : 0;
        }
    }
}
