namespace AsehellmannAppApi.Modelos.ModeloDto.PrestamoDtos
{
    public class PrevisualizarPrestamoDto
    {
        public float montoPrestamo { get; set; }
        public int plazoPrestamo { get; set; }
        public List<PrevisualizarPrestamoRowDto> detalles { get; set; }
    }
}
