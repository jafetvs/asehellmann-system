using AsehellmannAppApi.Modelos;
using AsehellmannAppApi.Modelos.ModeloDto.AhorrosDtos;
using AsehellmannAppApi.Modelos.ModeloDto.RegistroPagoAhorroDto;
using AsehellmannAppApi.Modelos.ModeloDto.RegistroPagoPrestamoDto;
using AsehellmannAppApi.Repositorio.IRepositorio;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace AsehellmannAppApi.Controllers
{
    [ApiController]
    [Route("api/RegistroPagoAhorroController")]
    public class RegistroPagoAhorroController : ControllerBase
    {
        private readonly IRegistroPagoAhorroRepositorio _registroRepo;
      
        private readonly IMapper _mapper;

        public RegistroPagoAhorroController(IRegistroPagoAhorroRepositorio registroRepo, IMapper mapper, IAhorroRepositorio @object)
        {
            _registroRepo = registroRepo;
            _mapper = mapper;
         
        }

        [HttpGet("mostrarRegistroPagoAhorros")]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult mostrarRegistroPagoAhorros()
        {
            var listaRegistroPagoAhorros = _registroRepo.getRegistroPagoAhorros();
            var listaRegistroPagoAhorrosDto = new List<MostrarRegistroPagoAhorroDto>();

            foreach (var registroPagoAhorro in listaRegistroPagoAhorros)
            {
                var mostrarAhorroDto = _mapper.Map<MostrarAhorroDto>(registroPagoAhorro.Ahorro);
                var registroPagoAhorroDto = new MostrarRegistroPagoAhorroDto
                {
                    mostrarAhorro = mostrarAhorroDto,
                    fechaRegistro = registroPagoAhorro.fechaRegistro,
                    montoAhorroRegistrado = registroPagoAhorro.montoAhorroRegistrado,
                };
                listaRegistroPagoAhorrosDto.Add(registroPagoAhorroDto);
            }
            return Ok(listaRegistroPagoAhorrosDto);
        }

        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [HttpPost("crearRegistroPagoAhorro")]
        public IActionResult CrearRegistroPagoAhorro()
        {
            bool registroCreado = _registroRepo.CrearRegistroPagoAhorro();

            if (registroCreado)
            {
                return Ok("Se han creado los registros de pago de ahorro correctamente.");
            }
            else
            {
                return StatusCode(500, "Se produjo un error al intentar crear los registros de pago de ahorro.");
            }
        }


        [HttpGet("mostrarRegistroPagoAhorrosPorUsuario/{cedula}")]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult MostrarRegistroPagoAhorrosPorUsuario(string cedula)
        {
            var listaRegistroPagoAhorros = _registroRepo.getRegistroPagoAhorroUsuarioEspecifico(cedula);
            var listaRegistroPagoAhorrosDto = new List<MostrarRegistroPagoAhorroDto>();

            foreach (var registroPagoAhorro in listaRegistroPagoAhorros)
            {
                var mostrarAhorroDto = _mapper.Map<MostrarAhorroDto>(registroPagoAhorro.Ahorro);
                var registroPagoAhorroDto = new MostrarRegistroPagoAhorroDto
                {
                    mostrarAhorro = mostrarAhorroDto,
                    fechaRegistro = registroPagoAhorro.fechaRegistro,
                    montoAhorroRegistrado = registroPagoAhorro.montoAhorroRegistrado,
                };
                listaRegistroPagoAhorrosDto.Add(registroPagoAhorroDto);
            }

            return Ok(listaRegistroPagoAhorrosDto);
        }

    }
}
