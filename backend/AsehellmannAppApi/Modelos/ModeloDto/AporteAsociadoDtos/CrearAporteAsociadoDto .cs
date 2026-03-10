using System.ComponentModel.DataAnnotations;

namespace AsehellmannAppApi.Modelos.ModeloDto.AporteAsociadoDtos
{
    public class CrearAporteAsociadoDto
    {
        [Required(ErrorMessage = "La Cedula es obligatoria")]
        public string cedula { get; set; }
        public int aportePatronal { get; set; }
        public int aportePersonal { get; set; }

        [Required(ErrorMessage = "El Mes es obligatoria")]
        public int mes { get; set; }
        [Required(ErrorMessage = "El Anio es obligatoria")]
        public int anio { get; set; }

    }
}
