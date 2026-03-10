using AsehellmannAppApi.Modelos.ModeloDto.AhorrosDtos;
using AsehellmannAppApi.Repositorio.IRepositorio;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using XAct;

namespace AsehellmannAppApi.Controllers
{
    [ApiController]
    [Route("api/Ahorro")]
    public class AhorroController : ControllerBase
    {
        private readonly IAhorroRepositorio _ahorroRepo;
        private readonly IUsuarioRepositorio _usRepo;
        private readonly IMapper _mapper;

        public AhorroController(IAhorroRepositorio ahorroRepo, IMapper mapper, IUsuarioRepositorio usuario)
        {
            _ahorroRepo = ahorroRepo;
            _mapper = mapper;
            _usRepo = usuario;
        }

        [HttpPost("crearAhorroUsuarioEspecifico")]
        [ProducesResponseType(201, Type = typeof(CrearAhorroDto))]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public IActionResult crearAhorroUsuarioEspecifico([FromBody] CrearAhorroDto crearAhorroDto)
        {
            if (!ModelState.IsValid || crearAhorroDto == null)
            {
                return Conflict(ModelState);
            }

            // Verificar si el usuario existe
            var usuarioExiste = _usRepo.existeUsuario(crearAhorroDto.cedula);
            if (!usuarioExiste)
            {
                return NotFound("El usuario no existe");
            }

            if (crearAhorroDto.tipoAhorro != "navidad" && crearAhorroDto.tipoAhorro != "cuestaEnero")
            {
                return Conflict($"Tipo de ahorro no valido: {crearAhorroDto.tipoAhorro}");
            }

            // Obtener los tipos de ahorro del usuario
            var tiposAhorroUsuario = _ahorroRepo.obtenerTiposAhorroPorCedula(crearAhorroDto.cedula);

            // Verificar si el usuario ya tiene un ahorro del tipo especificado en crearAhorroDto
            if (tiposAhorroUsuario.Contains(crearAhorroDto.tipoAhorro))
            {
                return Conflict($"El usuario ya tiene un ahorro VIGENTE del tipo {crearAhorroDto.tipoAhorro}");
            }

            // Intentar crear el ahorro utilizando el método del repositorio
            if (_ahorroRepo.crearAhorro(crearAhorroDto))
            {
                return Ok(crearAhorroDto);
            }

            ModelState.AddModelError("", $"Algo salió mal guardando el aporte adjuntado");
            return StatusCode(500, ModelState);
        }



        [HttpGet("obtenerAhorros")]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult getAhorrosOrderByCedula()
        {
            var listaAhorros = _ahorroRepo.getAhorros(); //lista de Ahorro
            var listaAhorrosDto = new List<MostrarAhorroDto>();

            foreach (var lista in listaAhorros)
            {
                listaAhorrosDto.Add(_mapper.Map<MostrarAhorroDto>(lista));
            }
            return Ok(listaAhorrosDto);
        }

        [HttpGet("obtenerAhorroEspecifico/{cedula}")]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult getAhorrosUsuarioEspecifico(string cedula)
        {
            // Obtener la lista de ahorros de asociados para la cédula proporcionada
            var listaAhorrosUsuario = _ahorroRepo.getAhorroUsuarioEspecifico(cedula);

            if (listaAhorrosUsuario == null || !listaAhorrosUsuario.Any())
            {
                return NotFound("No se encontraron ahorros para el usuario con la cédula proporcionada.");
            }

            // Mapear la lista de aportes asociados a una lista de DTOs
            var listaAhorroDto = _mapper.Map<List<MostrarAhorroDto>>(listaAhorrosUsuario);
            return Ok(listaAhorroDto); // Devolver los DTOs mapeados
        }
        [HttpPatch("actualizarAhorroMontoDebitar/{idAhorro}")]
        [ProducesResponseType(201, Type = typeof(AhorroDto))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult ActualizarAhorroMontoDebitar(int idAhorro, [FromBody] ActualizarAhorroMontoDebitarDto dto)
        {
            if (!ModelState.IsValid || dto == null)
            {
                return BadRequest(ModelState);
            }

            // Intentar actualizar el ahorro utilizando el método del repositorio
            bool actualizacionExitosa = _ahorroRepo.actualizarAhorroMontoDebitar(idAhorro, dto.montoDebitar);

            if (actualizacionExitosa)
            {
                return Ok("Monto de débito actualizado exitosamente");
            }

            return Conflict("No se pudo actualizar el monto de débito del ahorro");
        }
        [HttpPatch("actualizarStatus/{idAhorro}")]
        [ProducesResponseType(201, Type = typeof(AhorroDto))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult ActualizarStatus(int idAhorro, [FromBody] ActualizarStatusAhorroDto dto)
        {
            if (!ModelState.IsValid || dto == null)
            {
                return Conflict(ModelState);
            }

            if (dto.nuevoStatus == "CERRADO")
            {
                _ahorroRepo.actualizarStausCerrado(idAhorro);
                return Ok("Se actualiza el estado del ahorro a: CERRADO ");
            }
            if (dto.nuevoStatus == "TERMINADO")
            {
                _ahorroRepo.actualizarStausTerminado(idAhorro);
                return Ok("Se actualiza el estado del ahorro a: TERMINADO ");
            }

            // Verificar si existe al menos otro ahorro activo con el mismo tipo
            bool existeAhorroActivo = _ahorroRepo.existeAhorroActivoSegunStatus(idAhorro);

            // Si existe al menos otro ahorro activo con el mismo tipo, no se permite actualizar el estado
            if (existeAhorroActivo)
            {
                return Conflict("No se puede actualizar el estado del ahorro porque hay otro ahorro vigente con el mismo tipo");
            }

            // Intentar actualizar el estado del ahorro utilizando el método del repositorio
            bool actualizacionExitosa = _ahorroRepo.actualizarStatusVigente(idAhorro, dto.nuevoStatus);

            if (actualizacionExitosa)
            {
                return Ok("Estado del ahorro actualizado exitosamente");
            }

            return Conflict("No se pudo actualizar el estado del ahorro");
        }




    }
}
