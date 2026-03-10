using System.ComponentModel.DataAnnotations;
using AsehellmannAppApi.Modelos.ModeloDto;
using AsehellmannAppApi.Modelos.ModeloDto.FeriaProveedor;

namespace AsehellmannAppApi.Modelos.ModeloDto.RegistroPagoFeria
{
    public class RegistroPagoFeriaDto
    {
        public int Id { get; set; }

        [Required]
        public int FeriaProveedorId { get; set; }

        [Required]
        public float MontoCompra { get; set; }

        public float PagoRealizado { get; set; }
        public float MontoPagarMes { get; set; }
        public int Plazo { get; set; }
        public int PlazoRealizado { get; set; }

        public UsuarioDatosDto Usuario { get; set; }
        public FeriaProveedorDto FeriaProveedor { get; set; }
    }
}
