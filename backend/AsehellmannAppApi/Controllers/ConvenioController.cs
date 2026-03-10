using AsehellmannAppApi.Modelos.ModeloDto;
using AsehellmannAppApi.Modelos.ModeloDto.ConvenioDtos;
using AsehellmannAppApi.Repositorio.IRepositorio;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace AsehellmannAppApi.Controllers
{
    [ApiController]
    [Route("api/convenios")]
    public class ConvenioController : ControllerBase    {
        private readonly IConvenioRepositorio _convRepo;
        private readonly IMapper _mapper;

        public ConvenioController(IConvenioRepositorio convRepo, IMapper mapper)
        {
            _convRepo = convRepo;
            _mapper = mapper;
        }
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult getConvenio()
        {
            var listaConvenio = _convRepo.getConvenios();
            var listaConveniosDto = new List<ConvenioDto>();

            foreach (var lista in listaConvenio)
            {
                listaConveniosDto.Add(_mapper.Map<ConvenioDto>(lista));
            }
            return Ok(listaConveniosDto);
        }


        [HttpGet("ConveniosStatusActivo")]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult getConvenioStatus()
        {
            var listaConvenio = _convRepo.getConveniosActivos();
            var listaConveniosDto = new List<ConvenioDto>();

            foreach (var lista in listaConvenio)
            {
                listaConveniosDto.Add(_mapper.Map<ConvenioDto>(lista));
            }
            return Ok(listaConveniosDto);
        }

        [HttpGet("{id}", Name = "getConvenio")]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult getConvenio(int id)
        {
            var itemConvenio = _convRepo.getConvenio(id);
            if (itemConvenio == null)
            {
                return NotFound();
            }
            var itemConvenioDto = _mapper.Map<ConvenioDto>(itemConvenio);
            return Ok(itemConvenioDto);
        }

      
        [HttpPost]
        [ProducesResponseType(201, Type = typeof(CrearConvenioDto))]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult CrearConvenio([FromBody] CrearConvenioDto crearConvenioDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (crearConvenioDto == null)
            {
                return BadRequest(ModelState);
            }
           
            var convenio = _mapper.Map<Convenio>(crearConvenioDto);
            if (!_convRepo.crearConvenio(convenio))
            {
                ModelState.AddModelError("", $"Algo salio mal guardando el convenio {convenio.nombre}");
                return StatusCode(500, ModelState);
            }
            return CreatedAtRoute("getConvenio", new { id = convenio.Id}, convenio);
        }




        [HttpPatch("{id}", Name = "ActualizarPatchConvenio")]
        [ProducesResponseType(201, Type = typeof(ConvenioDto))]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult ActualizarPatchConvenio(int id, [FromBody] CrearConvenioDto convenioDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (convenioDto == null || !_convRepo.existeConvenio(id))
            {
                return BadRequest(ModelState);
            }

            var convenio = _convRepo.getConvenio(id);
            if (convenio == null)
            {
                ModelState.AddModelError("", $"No se encontró el convenio con el id: {id}");
                return BadRequest(ModelState);
            }

            _mapper.Map(convenioDto, convenio);

            if (!_convRepo.actualizarConvenio(convenio))
            {
                ModelState.AddModelError("", $"Algo salio mal actualizando el usaurio {convenio.nombre}");
                return StatusCode(500, ModelState);
            }
            return NoContent();
        }

        [HttpPatch("cambiarStatus/{id}", Name = "borrarConvenio")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult cambiarStatus(int id)
        {
            if (!_convRepo.existeConvenio(id))
            {
                return NotFound();
            }
            var convenio = _convRepo.getConvenio(id);

            if (!_convRepo.setStatusInactivo(convenio))
            {
                ModelState.AddModelError("", $"Algo salio mal borrando el registro con el ID: {id}");
                return StatusCode(404, ModelState);
            }
            return NoContent();
        }


    }

}
