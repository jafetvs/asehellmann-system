using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.Identity.Client;

namespace AsehellmannAppApi.Modelos
{
    public class Prestamo
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int idPrestamo { get; set; }
        public string tipoPrestamo { get; set; } //adelantoSalario y personal
        public float montoPrestamo { get; set; }  
        public float intereses { get; set; }
        public int plazoPrestamo { get; set; } //Puede ser a 12 meses 24 meses o 36.
        public int plazoRealizado { get; set; }
        public float cuotaAPagar { get; set; }
        public float saldoPrestamo { get; set; }
        public float saldoFinal { get; set; }
        public float totalMontoPagar { get; set; }
        public DateTime fechaSolicitud { get; set; }
        public string status { get;  set;} //TERMINADO DENEGADO APROBADO

        //Agregar propiedad navegacion
        [ForeignKey("Usuario")]
        public string UsuarioId { get; set; }
        public Usuario Usuario { get; set; }


        // Agrega la propiedad de navegación para RegistroPagoPrestamo
        public virtual ICollection<RegistroPagoPrestamo> RegistroPagoPrestamo { get; set; }


        //Metodos
        public Prestamo() { }
        public Prestamo(Usuario usuario, string tipoPrestamo, int montoPrestamo, string usuarioId, int plazoPrestamo, string status)
        {
            this.Usuario = usuario;
            this.tipoPrestamo = tipoPrestamo;
            this.montoPrestamo = montoPrestamo;
            this.intereses = 0.20f; // 20% del monto del préstamo
            this.fechaSolicitud = DateTime.Now;
            this.plazoPrestamo = plazoPrestamo;
            this.plazoRealizado = 0;
            this.saldoPrestamo = montoPrestamo;
            this.UsuarioId = usuarioId;
            this.cuotaAPagar = redondeo(CalculoCuotaAPagar(montoPrestamo, this.intereses, this.plazoPrestamo));
            this.status = status;
        }

        public float CalculoCuotaAPagar(float montoPrestamo, float intereses, int plazoPrestamo)
        {
            float tasaMensual = intereses / 12;
            int numeroPagos = plazoPrestamo;
            float cuota = montoPrestamo * (tasaMensual * (float)Math.Pow(1 + tasaMensual, numeroPagos)) / ((float)Math.Pow(1 + tasaMensual, numeroPagos) - 1);
            return cuota;
        }

        public float redondeo(float valor)
        {
            // Redondear al próximo múltiplo de 1000
            float valorRedondeado = (float)(Math.Ceiling(valor / 1000.0) * 1000.0);

            return valorRedondeado;
        }


    }

}
