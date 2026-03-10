using AsehellmannAppApi.Modelos;
using AsehellmannAppApi.Modelos.ModeloDto.PrestamoDtos;
using AsehellmannAppApi.Repositorio.IRepositorio;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace AsehellmannAppApi.Controllers
{
    [ApiController]
    [Route("api/Prestamo")]
    public class PrestamoController : ControllerBase
    {
        private readonly IPrestamoRepositorio _prestRepo;
        private readonly IMapper _mapper;

        //Constructor 
        public PrestamoController(IPrestamoRepositorio prestRepo, IMapper mapper)
        {
            _prestRepo = prestRepo;
            _mapper = mapper;
        }

        [HttpPost("crearPrestamo")]
        [ProducesResponseType(201, Type = typeof(CrearPrestamoDto))]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult CrearPrestamo([FromBody] CrearPrestamoDto crearPrestamoDto)
        {
            // Llamada al método del repositorio para crear el préstamo
            Prestamo prestamoCreado = _prestRepo.crearPrestamo(crearPrestamoDto);

            if (prestamoCreado != null)
            {
                return Ok("Préstamo creado exitosamente.");
            }
            else
            {
                return BadRequest("No tiene aportes suficientes para optar por este préstamo o el usuario no existe.");
            }
        }


        [HttpGet("obtenerPrestamos")]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult getAportesOrderByCedula()
        {
            var listaPrestamo = _prestRepo.getAllPrestamos();
            var listaPrestamoDto = new List<PrestamoDto>();

            foreach (var lista in listaPrestamo)
            {
                listaPrestamoDto.Add(_mapper.Map<PrestamoDto>(lista));
            }
            return Ok(listaPrestamoDto);
        }

        [HttpGet("obtenerPrestamoEspecifico/{cedula}")]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult getAhorrosUsuarioEspecifico(string cedula)
        {
            // Obtener la lista de ahorros de asociados para la cédula proporcionada
            var listaPrestamosUsuario = _prestRepo.getPrestamoUsuarioEspecifico(cedula);

            if (listaPrestamosUsuario == null || !listaPrestamosUsuario.Any())
            {
                return NotFound("No se encontraron ahorros para el usuario con la cédula proporcionada.");
            }

            // Mapear la lista de aportes asociados a una lista de DTOs
            var listaPrestamosUsuarioDTO = _mapper.Map<List<PrestamoDto>>(listaPrestamosUsuario);
            return Ok(listaPrestamosUsuarioDTO); // Devolver los DTOs mapeados
        }

        [HttpPatch("actualizarStatus/{idPrestamo}")]
        [ProducesResponseType(201, Type = typeof(PrestamoDto))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult ActualizarStatus(int idPrestamo, [FromBody] ActualizarStatusPrestamoDto dto)
        {
            if (!ModelState.IsValid || dto == null)
            {
                return Conflict(ModelState);
            }

            bool actualizacionExitosa = _prestRepo.actualizarStatus(idPrestamo, dto.status);

            if (actualizacionExitosa)
            {
                return Ok("Se actualiza el estado del préstamo");
            }
            else
            {
                return BadRequest("No se pudo actualizar el estado del préstamo. Verifica los parámetros proporcionados.");
            }
        }


        [HttpPatch("actualizarCuotaAPagar/{idPrestamo}")]
        [ProducesResponseType(201, Type = typeof(PrestamoDto))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult actualizarCuentaAPagar(int idPrestamo, [FromBody] ActualizarCuotaAPagarPrestamoDto dto)
        {
            if (!ModelState.IsValid || dto == null)
            {
                return Conflict(ModelState);
            }

            bool actualizacionExitosa = _prestRepo.actualizarCuotaAPagar(idPrestamo, dto.cuotaPagar);

            if (actualizacionExitosa)
            {
                return Ok("Se actualiza la cuota del préstamo");
            }
            else
            {
                return BadRequest("No se pudo actualizar el estado del préstamo. Verifica los parámetros proporcionados.");
            }
        }

        [HttpGet("previsualizar/{monto}/{plazoPrestamo}")]
        public IActionResult PrevisualizarPrestamo(float monto, int plazoPrestamo)
        {
            // Llama al método del repositorio para previsualizar el préstamo
            var previsualizacion = _prestRepo.previsualizarPrestamo(monto, plazoPrestamo);

            if (previsualizacion != null)
            {
                return Ok(previsualizacion);
            }
            else
            {
                return BadRequest("No se pudo previsualizar el préstamo. Verifica los parámetros proporcionados.");
            }
        }






    }
}
