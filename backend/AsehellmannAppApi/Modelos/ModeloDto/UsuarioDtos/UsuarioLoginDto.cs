    using System.ComponentModel.DataAnnotations;

namespace AsehellmannAppApi.Modelos.ModeloDto
{
    public class UsuarioLoginDto
    {
        [Required(ErrorMessage = "La cedula del usuario es obligatoria")]
        public string  cedula { get; set; }
        [Required(ErrorMessage = "La contraseña es obligatoria")]
        public string password { get; set; }
    }
}
