using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AsehellmannAppApi.Modelos
{
    public class Ahorro
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int idAhorro{ get; set; }
        public string tipoAhorro { get; set; }
        public int montoDebitar { get; set; }
        public DateTime fechaInicio { get; set; }
        public DateTime fechaFin { get; set; }
        public string status { get; set; }  // VIGENTE CERRADO TERMINADO

        // Agrega la propiedad UsuarioId
        [ForeignKey("Usuario")]
        public string UsuarioId { get; set; }
        public Usuario Usuario { get; set; }
        
        // Agrega la propiedad de navegación para RegistroPagoAhorro
        public virtual ICollection<RegistroPagoAhorro> RegistroPagoAhorros { get; set; }


        public Ahorro() { }
         public Ahorro(Usuario usuario, string tipoAhorro, int montoDebitar, DateTime fechaInicio, string status = "VIGENTE")
        {
            this.Usuario = usuario;
            this.tipoAhorro = tipoAhorro;
            this.montoDebitar = montoDebitar;
            this.fechaInicio = fechaInicio;
            // Llama al método para asignar la fecha de fin
            AsignarFechaFin();
            this.status = status;
        }
        public void AsignarFechaFin()
        {
            // Verificar el tipo de ahorro
            if (tipoAhorro == "navidad")
            {
                // Asignar la fecha de fin al último día del mes 12 del mismo año de fechaInicio
                fechaFin = new DateTime(fechaInicio.Year, 12, DateTime.DaysInMonth(fechaInicio.Year, 12));
            }
            else if (tipoAhorro == "cuestaEnero")
            {
                // Asignar la fecha de fin al último día del mes 1 del siguiente año
                fechaFin = new DateTime(fechaInicio.Year + 1, 1, DateTime.DaysInMonth(fechaInicio.Year + 1, 1));
            }
            // Agrega más condiciones para otros tipos de ahorro si es necesario
        }
    }
}
