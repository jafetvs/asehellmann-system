using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace AsehellmannAppApi.Modelos.ModeloDto
{
    public class UsuarioActualizarDto
    {
        public string nombre { get; set; }
        public string apellidos { get; set; }
        public int idEmpleado { get; set; }
        
        public string email { get; set; }

        public string status { get; set; }

        public string role { get; set; }
        
    }
}
