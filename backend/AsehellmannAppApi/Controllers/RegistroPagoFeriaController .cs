using AsehellmannAppApi.Modelos;
using AsehellmannAppApi.Modelos.ModeloDto.RegistroPagoFeria;
using AsehellmannAppApi.Repositorio.IRepositorio;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace AsehellmannAppApi.Controllers
{
    [ApiController]
    [Route("api/registroPagoFeria")]
    public class RegistroPagoFeriaController : ControllerBase
    {
        private readonly IRegistroPagoFeriaRepositorio _registroPagoFeriaRepo;
        private readonly IMapper _mapper;

        public RegistroPagoFeriaController(IRegistroPagoFeriaRepositorio registroPagoFeriaRepo, IMapper mapper)
        {
            _registroPagoFeriaRepo = registroPagoFeriaRepo;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult ObtenerTodosLosRegistrosPagoFeria()
        {
            var listaRegistros = _registroPagoFeriaRepo.ObtenerTodosLosRegistrosPagoFeria();
            var listaRegistrosDto = _mapper.Map<IEnumerable<RegistroPagoFeriaDto>>(listaRegistros);
            return Ok(listaRegistrosDto);
        }

        [HttpGet("{id:int}", Name = "ObtenerRegistroPagoFeriaPorId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult ObtenerRegistroPagoFeriaPorId(int id)
        {
            var registro = _registroPagoFeriaRepo.ObtenerRegistroPagoFeriaPorId(id);
            if (registro == null)
            {
                return NotFound();
            }
            var registroDto = _mapper.Map<RegistroPagoFeriaDto>(registro);
            return Ok(registroDto);
        }

        [HttpGet("usuario/{cedula}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult ObtenerRegistrosPagoFeriaPorUsuario(string cedula)
        {
            var registros = _registroPagoFeriaRepo.ObtenerRegistrosPagoFeriaPorUsuario(cedula);
            var registrosDto = _mapper.Map<IEnumerable<RegistroPagoFeriaDto>>(registros);
            return Ok(registrosDto);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult CrearRegistroPagoFeria([FromBody] CrearRegistroPagoFeriaDto crearRegistroPagoFeriaDto)
        {
            if (!ModelState.IsValid || crearRegistroPagoFeriaDto == null)
            {
                return BadRequest(ModelState);
            }

            var registroPagoFeria = _mapper.Map<RegistroPagoFeria>(crearRegistroPagoFeriaDto);

            if (!_registroPagoFeriaRepo.CrearRegistroPagoFeria(registroPagoFeria))
            {
                ModelState.AddModelError("", $"Algo salió mal guardando el registro de pago de feria");
                return StatusCode(500, ModelState);
            }

            var registroPagoFeriaDto = _mapper.Map<RegistroPagoFeriaDto>(registroPagoFeria);
            return CreatedAtRoute("ObtenerRegistroPagoFeriaPorId", new { id = registroPagoFeria.Id }, registroPagoFeriaDto);
        }

        [HttpPut("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult ActualizarRegistroPagoFeria(int id, [FromBody] ActualizarRegistroPagoFeriaDto actualizarRegistroPagoFeriaDto)
        {
            if (!ModelState.IsValid || actualizarRegistroPagoFeriaDto == null || id != actualizarRegistroPagoFeriaDto.Id)
            {
                return BadRequest(ModelState);
            }

            var registroPagoFeria = _mapper.Map<RegistroPagoFeria>(actualizarRegistroPagoFeriaDto);

            if (!_registroPagoFeriaRepo.ActualizarRegistroPagoFeria(registroPagoFeria))
            {
                ModelState.AddModelError("", $"Algo salió mal actualizando el registro de pago de feria con ID: {id}");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }

        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult BorrarRegistroPagoFeria(int id)
        {
            var registro = _registroPagoFeriaRepo.ObtenerRegistroPagoFeriaPorId(id);
            if (registro == null)
            {
                return NotFound();
            }

            if (!_registroPagoFeriaRepo.BorrarRegistroPagoFeria(id))
            {
                ModelState.AddModelError("", $"Algo salió mal eliminando el registro de pago de feria con ID: {id}");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }
    }
}
