using AsehellmannAppApi.Modelos;
using AsehellmannAppApi.Modelos.ModeloDto;
using AsehellmannAppApi.Modelos.ModeloDto.UsuarioDtos;
using AsehellmannAppApi.Repositorio.IRepositorio;
using AsehellmannAppApi.Servicios;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using XAct;

namespace AsehellmannAppApi.Controllers
{
    [ApiController]
    [Route("api/usuarios")]
    public class UsuariosController : ControllerBase
    {
        private readonly IUsuarioRepositorio _usRepo;
        private readonly IMapper _mapper;
        protected RespuestaAPI _respuestaApi;
        private readonly IManejoRoles _usRol;
        private readonly ExcelService _excelService;
        public UsuariosController(IUsuarioRepositorio usRepo, IMapper mapper, IManejoRoles usRol, ExcelService excelService)
        {
            _usRepo = usRepo;
            this._respuestaApi = new();
            _mapper = mapper;
            _usRol = usRol;
            _excelService = excelService;
        }

        [AllowAnonymous]
        [HttpGet("GetUsuarios")]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetUsuarios()
        {
            var listaUsuariosDto = new List<MostrarTodoUsuarioDto>();

            foreach (var usuario in _usRepo.getUsuarios())
            {
                var usuarioDto = await _usRol.ObtenerUsuarioDtoConRolesAsync(usuario.Id);

                if (usuarioDto != null)
                {
                    listaUsuariosDto.Add(usuarioDto);
                }
            }

            return Ok(listaUsuariosDto);
        }

        [AllowAnonymous]
        [HttpGet("GetUsuario/{cedula}", Name = "getUsuario")]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetUsuario(string cedula)
        {
            var usuario = _usRepo.getUsuario(cedula);

            if (usuario == null)
            {
                return NotFound();
            }

            var usuarioDto = await _usRol.ObtenerUsuarioDtoConRolesAsync(usuario.Id);

            if (usuarioDto == null)
            {
                return NotFound();
            }

            return Ok(usuarioDto);
        }

        [HttpPatch("CambiarStatus/{cedula}/{status}", Name = "CambiarStatusInactivo")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult CambiarStatus(string cedula, string status)
        {
            if (!_usRepo.existeUsuario(cedula))
            {
                return NotFound();
            }

            var usuario = _usRepo.getUsuario(cedula);

            try
            {
                // Intenta cambiar el status del usuario
                if (!_usRepo.setStatus(usuario, status))
                {
                    ModelState.AddModelError("", $"Algo salió mal cambiando el status del usuario {usuario.nombre} {usuario.apellidos}");
                    return StatusCode(404, ModelState);
                }

                return Ok();
            }
            catch (ArgumentException ex)
            {
                // Captura la excepción de argumento no válido y maneja el error según sea necesario
                ModelState.AddModelError("", ex.Message);
                return BadRequest(ModelState);
            }
            catch (Exception ex)
            {
                // Maneja otras excepciones de manera general (log, notificación, etc.)
                // Puedes ajustar esto según tus necesidades
                Console.WriteLine($"Se produjo una excepción: {ex.Message}");
                return StatusCode(500); // Código de estado de error interno del servidor
            }
        }

        [HttpPatch("ActualizarUsuario/{cedula}", Name = "ActualizarPatchUsuario")]
        [ProducesResponseType(201, Type = typeof(UsuarioDto))]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult ActualizarPatchUsuario(string cedula, [FromBody] UsuarioActualizarDto usuarioDto)
        {
            if (!ModelState.IsValid || usuarioDto == null)
            {
                return BadRequest(ModelState);
            }

            // Actualizar el usuario usando el repositorio
            var actualizado = _usRepo.ActualizarUsuario(cedula, usuarioDto);

            if (!actualizado)
            {
                ModelState.AddModelError("", $"Algo salió mal actualizando el usuario con cédula {cedula}");
                return StatusCode(500, ModelState);
            }

            return Ok();
        }

        //Security
        //[Authorize(Roles = "admin")]
        [HttpPost("registro")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Registro(ApplicationDbContext contexto, [FromBody] UsuarioRegistroDto usuarioRegistroDto)
        {
            bool validarNombreUsuarioUnico = _usRepo.isUniqueUser(usuarioRegistroDto.cedula);

            if (!validarNombreUsuarioUnico)
            {
                _respuestaApi.StatusCode = HttpStatusCode.BadRequest;
                _respuestaApi.IsSuccess = false;
                _respuestaApi.ErrorMessages.Add("Ya existe un usuario con la cedula adjunta");
                return BadRequest(_respuestaApi);
            }

            var usuario = await _usRepo.registro(usuarioRegistroDto);

            if (usuario == null || !_respuestaApi.IsSuccess)
            {
                _respuestaApi.StatusCode = HttpStatusCode.BadRequest;
                _respuestaApi.IsSuccess = false;
                _respuestaApi.ErrorMessages.Add("Error en el registro");
                return BadRequest(_respuestaApi);
            }

            _respuestaApi.StatusCode = HttpStatusCode.OK;
            _respuestaApi.IsSuccess = true;
            return Ok(_respuestaApi);
        }
        [AllowAnonymous]
        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Login([FromBody] UsuarioLoginDto usuarioLoginDto)
        {
            var respuestaLogin = await _usRepo.login(usuarioLoginDto);

            if (respuestaLogin.Usuario == null || string.IsNullOrEmpty(respuestaLogin.Token))
            {
                _respuestaApi.StatusCode = HttpStatusCode.BadRequest;
                _respuestaApi.IsSuccess = false;
                _respuestaApi.ErrorMessages.Add("El nombre de usuario o password son incorrectos");
                return BadRequest(_respuestaApi);
            }

            _respuestaApi.StatusCode = HttpStatusCode.OK;
            _respuestaApi.IsSuccess = true;
            _respuestaApi.Result = respuestaLogin;
            return Ok(_respuestaApi);
        }
        [HttpPost("registro-desde-excel")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> RegistroDesdeExcel()
        {
            try
            {
                var rutaArchivoExcel = "C:/Users/XPC/Desktop/ASEHELLMANNAsociados.xlsx";
                var usuariosDesdeExcel = _excelService.LeerDatosUsuariosDesdeExcel(rutaArchivoExcel);

                foreach (var usuarioExcel in usuariosDesdeExcel)
                {
                    using (var contexto = new ApplicationDbContext())
                    {
                        // Verificar si el usuario ya existe en la base de datos
                        bool validarNombreUsuarioUnico = _usRepo.isUniqueUser(usuarioExcel.cedula);

                        if (!validarNombreUsuarioUnico)
                        {
                            // Puedes manejar de manera específica los usuarios duplicados en el Excel
                            // Por ejemplo, podrías agregarlos a una lista de errores y seguir con la iteración
                            continue;
                        }

                        // Crear un objeto UsuarioRegistroDto con los datos del usuario desde el Excel
                        var usuarioRegistroDto = new UsuarioRegistroDto
                        {
                            cedula = usuarioExcel.cedula,
                            nombre = usuarioExcel.nombre,
                            apellidos = usuarioExcel.apellidos,
                            idEmpleado = usuarioExcel.idEmpleado,
                            email = usuarioExcel.email,
                            password = usuarioExcel.password,
                            role = usuarioExcel.role,
                            status = usuarioExcel.status
                        };

                        // Llamar al endpoint de registro existente y esperar la respuesta
                        var response = await Registro(contexto, usuarioRegistroDto);

                        // Puedes agregar lógica adicional según tus necesidades
                        // Por ejemplo, podrías verificar la respuesta y manejar errores
                        // o agregar el usuario registrado a una lista de éxito
                    }
                }

                // Resto de tu lógica de registro desde Excel...

                return Ok(_respuestaApi);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error durante el registro desde Excel: {ex}");
                _respuestaApi.StatusCode = HttpStatusCode.InternalServerError;
                _respuestaApi.IsSuccess = false;
                _respuestaApi.ErrorMessages.Add($"Error durante el registro desde Excel: {ex.Message}");
                return StatusCode((int)HttpStatusCode.InternalServerError, _respuestaApi);
            }
        }
    }
}
