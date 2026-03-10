using AsehellmannAppApi.Modelos;
using AsehellmannAppApi.Modelos.ModeloDto.FeriaProveedor;
using AsehellmannAppApi.Repositorio.IRepositorio;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace AsehellmannAppApi.Controllers
{
    [ApiController]
    [Route("api/feriaProveedor")]
    public class FeriaProveedorController : ControllerBase
    {
        private readonly IFeriaProveedorRepositorio _feriaProveedorRepo;
        private readonly IMapper _mapper;

        public FeriaProveedorController(IFeriaProveedorRepositorio feriaProveedorRepo, IMapper mapper)
        {
            _feriaProveedorRepo = feriaProveedorRepo;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult GetFeriaProveedores()
        {
            var listaFeriaProveedores = _feriaProveedorRepo.getFeriaProveedores();
            return Ok(listaFeriaProveedores);
        }

        [HttpGet("{nombre}")]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult GetFeriaProveedores(string nombre)
        {
            var listaFeriaProveedores = _feriaProveedorRepo.getFeriaProveedores(nombre);
            return Ok(listaFeriaProveedores);
        }

        [HttpPost]
        [ProducesResponseType(201, Type = typeof(CrearFeriaProveedorDto))]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult CrearFeriaProveedor([FromBody] CrearFeriaProveedorDto crearFeriaProveedorDto)
        {
            if (!ModelState.IsValid || crearFeriaProveedorDto == null)
            {
                return BadRequest(ModelState);
            }

            var feriaProveedor = _mapper.Map<FeriaProveedor>(crearFeriaProveedorDto);
            if (!_feriaProveedorRepo.crearFeriaProveedor(feriaProveedor))
            {
                ModelState.AddModelError("", $"Algo salió mal guardando el proveedor de feria {feriaProveedor.nombreProveedor}");
                return StatusCode(500, ModelState);
            }
            return Ok("Feria proveedor creada correctamente");
        }



        [HttpPut("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult ActualizarFeriaProveedor(int id, [FromBody] FeriaProveedor feriaProveedor)
        {
            if (!ModelState.IsValid || feriaProveedor == null || id != feriaProveedor.idFeriaProveedor)
            {
                return BadRequest(ModelState);
            }

            if (!_feriaProveedorRepo.actualizarFeriaProveedor(feriaProveedor))
            {
                ModelState.AddModelError("", $"Algo salió mal actualizando el proveedor de feria con ID: {id}");
                return StatusCode(500, ModelState);
            }
            return NoContent();
        }

        // Otras acciones (eliminar, etc.) se pueden agregar de manera similar.
    }
}
