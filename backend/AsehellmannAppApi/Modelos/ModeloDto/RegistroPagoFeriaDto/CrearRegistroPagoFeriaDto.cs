using System;
using System.ComponentModel.DataAnnotations;

namespace AsehellmannAppApi.Modelos.ModeloDto.RegistroPagoFeria
{
    public class CrearRegistroPagoFeriaDto
    {
        [Required]
        public int FeriaProveedorId { get; set; }

        [Required]
        public float MontoCompra { get; set; }

        public float PagoRealizado { get; set; }
        public int Plazo { get; set; }

        [Required]
        public string UsuarioCedula { get; set; }

        public DateTime FechaCompra { get; set; }
    }
}
