using AsehellmannAppApi.Modelos.ModeloDto.UsuarioDtos;

namespace AsehellmannAppApi.Modelos.ModeloDto.AporteAsociadoDtos
{
    public class AporteAsociadoDto
    {
        public UsuarioDatosDto Usuario { get; set; }
        public int aportePatronal { get; set; }
        public int aportePersonal { get; set; }
        public int aportePersonalesAcumulado { get; set; }
        public int aportePatronalesAcumulado { get; set; }
        public int mes {  get; set; }
        public int anio { get; set; }
    }
}
