using AsehellmannAppApi.Modelos;
using AsehellmannAppApi.Modelos.ModeloDto.PrestamoDtos;
using AsehellmannAppApi.Modelos.ModeloDto.RegistroPagoPrestamoDto;
using AsehellmannAppApi.Repositorio.IRepositorio;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace AsehellmannAppApi.Controllers
{
    [ApiController]
    [Route("api/RegistroPagoPrestamoController")]
    public class RegistroPagoPrestamoController : ControllerBase
    {
        private readonly IRegistroPagoPrestamoRepositorio _registroRepo;
        private readonly IMapper _mapper;

        public RegistroPagoPrestamoController(IRegistroPagoPrestamoRepositorio registroRepo, IMapper mapper)
        {
            _registroRepo = registroRepo;
            _mapper = mapper;

        }

        [HttpGet("mostrarRegistroPagoPrestamos")]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult mostrarRegistroPagoPrestamos()
        {
            var listaRegistroPagoPrestamos = _registroRepo.getRegistroPagoPrestamos();
            var listaRegistroPagoPrestamosDto = new List<MostrarRegistroPagoPrestamoDto>();

            foreach (var registroPagoPrestamo in listaRegistroPagoPrestamos)
            {
                var mostrarPrestamoDto = _mapper.Map<MostrarPrestamoDto>(registroPagoPrestamo.Prestamo);
                var registroPagoPrestamoDto = new MostrarRegistroPagoPrestamoDto
                {
                    mostrarPrestamo = mostrarPrestamoDto,
                    fechaRegistro = registroPagoPrestamo.fechaRegistro,
                    montoPrestamoRegistrado = registroPagoPrestamo.montoPrestamoRegistrado,
                };
                listaRegistroPagoPrestamosDto.Add(registroPagoPrestamoDto);
            }
            return Ok(listaRegistroPagoPrestamosDto);
        }

        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [HttpPost("crearRegistroPagoPrestamo")]
        public IActionResult CrearRegistroPagoPrestamo()
        {
            bool registroCreado = _registroRepo.CrearRegistroPagoPrestamo();

            if (registroCreado)
            {
                return Ok("Se han creado los registros de pago de Prestamo correctamente.");
            }
            else
            {
                return StatusCode(500, "Se produjo un error al intentar crear los registros de pago de Prestamo.");
            }
        }


        [HttpGet("mostrarRegistroPagoPrestamosPorUsuario/{cedula}")]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult MostrarRegistroPagoPrestamosPorUsuario(string cedula)
        {
            var listaRegistroPagoPrestamos = _registroRepo.getRegistroPagoPrestamoUsuarioEspecifico(cedula);
            var listaRegistroPagoPrestamosDto = new List<MostrarRegistroPagoPrestamoDto>();

            foreach (var registroPagoPrestamo in listaRegistroPagoPrestamos)
            {
                var mostrarPrestamoDto = _mapper.Map<MostrarPrestamoDto>(registroPagoPrestamo.Prestamo);
                var registroPagoPrestamoDto = new MostrarRegistroPagoPrestamoDto
                {
                    mostrarPrestamo = mostrarPrestamoDto,
                    fechaRegistro = registroPagoPrestamo.fechaRegistro,
                    montoPrestamoRegistrado = registroPagoPrestamo.montoPrestamoRegistrado,
                };
                listaRegistroPagoPrestamosDto.Add(registroPagoPrestamoDto);
            }

            return Ok(listaRegistroPagoPrestamosDto);
        }

    }
}
