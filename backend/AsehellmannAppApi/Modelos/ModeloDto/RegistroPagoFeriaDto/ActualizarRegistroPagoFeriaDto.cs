using System;
using System.ComponentModel.DataAnnotations;

namespace AsehellmannAppApi.Modelos.ModeloDto.RegistroPagoFeria
{
    public class ActualizarRegistroPagoFeriaDto
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public int FeriaProveedorId { get; set; }

        [Required]
        public float MontoCompra { get; set; }

        public float PagoRealizado { get; set; }
        public float MontoPagarMes { get; set; }
        public int Plazo { get; set; }
        public int PlazoRealizado { get; set; }

        [Required]
        public string UsuarioCedula { get; set; }

        public DateTime FechaCompra { get; set; }
    }
}
