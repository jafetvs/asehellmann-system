using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace AsehellmannAppApi.Modelos.ModeloDto
{
    public class UsuarioDto
    {
        public string cedula { get; set; }
        public int idEmpleado { get; set; }
        public string nombre { get; set; }
        public string apellidos { get; set; }
        
        public string correo { get; set; }

        public string password { get; set; }

        public string role { get; set; }
        
        public string status { get; set; }
    }
}
