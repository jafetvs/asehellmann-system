using System.ComponentModel.DataAnnotations;

namespace AsehellmannAppApi.Modelos.ModeloDto
{
    public class UsuarioRegistroDto
    {
        [Required(ErrorMessage = "El nombre es obligatorio")]
        public string nombre { get; set; }
        [Required(ErrorMessage = "Los apellidos son obligatorios")]
        public string apellidos { get; set; }
        [Required(ErrorMessage = "cedula es obligatoria")]
        public string cedula { get; set; }

        [Required(ErrorMessage = "Codigo del empleado de la empresa es obligatorio")]
        public int idEmpleado { get; set; }

        [Required(ErrorMessage = "El correo es obligatorio")]
        public string email { get; set; }
        [Required(ErrorMessage = "El status es obligatoria")]
        public string status { get; set; }
        [Required(ErrorMessage = "La contraseña es obligatoria")]
        public string password { get; set; }
        [Required(ErrorMessage = "El rol es obligatoria")]
        public string role { get; set; }

    }
}
