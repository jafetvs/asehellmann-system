
using AsehellmannAppApi.Modelos.ModeloDto;
using AsehellmannAppApi.Modelos.ModeloDto.AporteAsociadoDtos;
using AsehellmannAppApi.Modelos.ModeloDto.UsuarioDtos;
using AsehellmannAppApi.Repositorio.IRepositorio;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ClosedXML;

namespace AsehellmannAppApi.Controllers
{

    [ApiController]
    [Route("api/aporteAsociado")]
    public class AporteAsociadoController : ControllerBase
    {
        private readonly IAporteAsociadoRepositorio _aporteRepo;
        private readonly IMapper _mapper;

        public AporteAsociadoController(IAporteAsociadoRepositorio usRepo, IMapper mapper)
        {
            _aporteRepo = usRepo;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult getAportesOrderByCedula()
        {
            var listaAporteAsociado = _aporteRepo.getAportesOrderByCedula(); 
            var listaAportesAsociadoDto = new List<AporteAsociadoDto>();

            foreach (var lista in listaAporteAsociado)
            {
                listaAportesAsociadoDto.Add(_mapper.Map<AporteAsociadoDto>(lista));
            }
            return Ok(listaAportesAsociadoDto);
        }

        [HttpGet("{cedula}", Name = "getAporteUsuarioEspecifico")]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult getAporteUsuarioEspecifico(string cedula)
        {
            // Obtener la lista de aportes asociados para la cédula proporcionada
            var listaAporteAsociado = _aporteRepo.getAporteUsuarioEspecifico(cedula);

            // Verificar si la lista es nula o está vacía
            if (listaAporteAsociado == null || !listaAporteAsociado.Any())
            {
                return NotFound("No se encontraron aportes asociados para la cédula proporcionada.");
            }

            // Mapear la lista de aportes asociados a una lista de DTOs
            var listaAportesAsociadoDto = _mapper.Map<List<AporteAsociadoDto>>(listaAporteAsociado);

            // Devolver la lista de DTOs
            return Ok(listaAportesAsociadoDto);
        }

        [HttpPost("/crearAporteUsuarioEspecifico")]
        [ProducesResponseType(201, Type = typeof(CrearAporteAsociadoDto))]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult crearAporteUsuarioEspecifico([FromBody] CrearAporteAsociadoDto creaAporteDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (creaAporteDto == null)
            {
                return BadRequest(ModelState);
            }
            if (_aporteRepo.usuarioAporteLigadoMes(creaAporteDto.cedula, creaAporteDto.mes, creaAporteDto.anio))
            {
                ModelState.AddModelError("", $"El usuario ya tiene un aporte ligado al mes y año indicado");
                return StatusCode(500, ModelState);
            }
            var aporte = _mapper.Map<CrearAporteAsociadoDto>(creaAporteDto);

            if (!_aporteRepo.crearAporte(aporte))
            {
                ModelState.AddModelError("", $"Algo salio mal guardando el aporte adjuntado");
                return StatusCode(500, ModelState);
            }
            return Ok(aporte);
        }

        [HttpDelete("{cedula},{mes},{anio}", Name = "borrarAporteAsociado")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult BorrarAporte(string cedula, int mes, int anio)
        {
            var aporteDto = new BuscarAporteAsociadoDto { cedula = cedula, mes = mes, anio = anio };
            bool exito = _aporteRepo.borrarAporte(aporteDto);

            if (exito)
            {
                return Ok("Aporte eliminado con éxito.");
            }
            else
            {
                return NotFound("No se encontró el usuario o el aporte no existe.");
            }
        }

        [HttpPatch("actualizarAporte")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult ActualizarAporte(string cedula, int mes, int anio, [FromBody] ActualizarAporteDto aporteDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (_aporteRepo.actualizarAporte(cedula, mes, anio, aporteDto))
            {
                return NoContent(); // Actualización exitosa

            }
            else
            {
                ModelState.AddModelError("", "No se pudo actualizar el aporte");    
                return StatusCode(500, ModelState);
            }
        }

        [HttpPost] IActionResult ImportarAportesAsociadosDesdeExcel(IFormFile excel)
        {


            return BadRequest(ModelState);


        }


    }
}
