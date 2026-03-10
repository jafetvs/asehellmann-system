using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace AsehellmannAppApi.Modelos.ModeloDto
{
    public class UsuarioDatosDto
    {
        public string cedula { get; set; }
         public int idEmpleado { get; set; }
        public string nombre { get; set; }
        public string apellidos { get; set; }

    }
}
