using System.ComponentModel.DataAnnotations;

namespace AsehellmannAppApi.Modelos.ModeloDto
{
    public class CrearUsuarioDto
    {
        [Required (ErrorMessage = "La Cedula es obligatoria")]
        public string cedula { get; set; }
        
        [Required(ErrorMessage = "El nombre es obligario")]
        [MaxLength(40, ErrorMessage = "El numero maximo de caracter es 40")]
        public string nombre { get; set; }

        [Required(ErrorMessage = "Los apellidos son obligatorios")]
        [MaxLength(40, ErrorMessage = "El numero maximo de caracter es 40")]
        public string apellidos { get; set; }

        [Required]
        public int idEmpleado { get; set; }    

            [Required(ErrorMessage = "Los apellidos son obligatorios")]
        [MaxLength(40, ErrorMessage = "El numero maximo de caracter es 40")]
        public string email {  get; set; }
        
        
        public string password { get; set; }
        
        [Required (ErrorMessage = "El rol es requerido")]
        public string role { get; set; }

        [Required(ErrorMessage = "El status es requerido")]
        public string status { get; set; }



    }
}
