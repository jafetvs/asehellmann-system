namespace AsehellmannAppApi.Modelos.ModeloDto.PrestamoDtos
{
    public class MostrarPrestamoDto
    {
        public UsuarioDatosDto Usuario { get; set; }
        public int idPrestamo { get; set; }
        public string tipoPrestamo { get; set; } //adelantoSalario y personal
        public float montoPrestamo { get; set; }
        public int plazoPrestamo { get; set; } 
        public int plazoRealizado { get; set; }
        public float cuotaAPagar { get; set; }
        public float saldoPrestamo { get; set; }
        public float saldoFinal { get; set; }
        public float totalMontoPagar { get; set; }

    }
}
