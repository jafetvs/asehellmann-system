using Microsoft.AspNetCore.Routing.Constraints;

namespace AsehellmannAppApi.Modelos.ModeloDto.PrestamoDtos
{
    public class PrevisualizarPrestamoRowDto
    {

        public int mes { get; set; }
        public float saldoPrestamo { get; set; }
        public float cuotaPagar { get; set; }
        public float principal { get; set; }
        public float intereses { get; set; }
        public float saldoFinal { get; set; }

    }
}
