using AsehellmannAppApi.Modelos.ModeloDto;
using AsehellmannAppApi.Modelos.ModeloDto.UsuarioDtos;
using AsehellmannAppApi.Repositorio.IRepositorio;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AsehellmannAppApi.Repositorio
{
    public class UsuarioRepositorio : IUsuarioRepositorio
    {
        private readonly ApplicationDbContext _bd; // Para poder acceder a la base de datos
        private string claveSecreta;
        private readonly IMapper _mapper;
        private readonly IManejoRoles _manejoRoles;
        private readonly UserManager<Usuario> _userManager;
        public UsuarioRepositorio(ApplicationDbContext bd, IConfiguration config, IMapper mapper, IManejoRoles manejoRoles, UserManager<Usuario> userManager)
        {
            _bd = bd;
            claveSecreta = config.GetValue<string>("ApiSettings:Secreta");
            _mapper = mapper;
            _manejoRoles = manejoRoles;
            _userManager = userManager;
        }

        public bool crearUsuario(Usuario usuario)
        {
            usuario.fechaCreacion = DateTime.UtcNow;
            _bd.Usuarios.Add(usuario);
            return guardar();
        }

        public bool existeUsuario(string cedula)
        {
            return _bd.Usuarios.Any(c => c.cedula == cedula);
        }

        public Usuario getUsuario(string cedula)
        {
            return _bd.Usuarios.FirstOrDefault(u => u.cedula == cedula);
        }

        public IEnumerable<Usuario> getUsuarios()
        {
            return _bd.Usuarios.OrderBy(u => u.apellidos).ToList();
        }

        public bool guardar()
        {
            return _bd.SaveChanges() >= 0;
        }

        public bool isUniqueUser(string cedula)
        {
            return _bd.Usuarios.FirstOrDefault(u => u.cedula == cedula) == null;
            //Devolverá el primer elemento que coincida o null si no se encuentra ningún elemento que coincida.
        }

        public async Task<UsuarioLoginRespuestaDto> login(UsuarioLoginDto usuarioLoginDto)
        {
            var usuario = _bd.Usuarios.FirstOrDefault(u => u.cedula == usuarioLoginDto.cedula);

            bool isValid = await _userManager.CheckPasswordAsync(usuario, usuarioLoginDto.password);

            if (usuario == null || isValid == false)
            {
                return new UsuarioLoginRespuestaDto()
                {
                    Token = "",
                    Usuario = null
                };
            }

            // Aquí cuando ya existe el usuario, entonces se procede con el login
            var roles = await _userManager.GetRolesAsync(usuario);

            var manejadorToken = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(claveSecreta);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
            new Claim(ClaimTypes.Name, usuario.nombre),
            new Claim(ClaimTypes.Surname, usuario.apellidos),
            // Incluye todos los roles del usuario en las claims del token
            new Claim(ClaimTypes.Role, string.Join(",", roles)),
                }),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = new(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = manejadorToken.CreateToken(tokenDescriptor);

            UsuarioLoginRespuestaDto usuarioLoginRespuestaDto = new UsuarioLoginRespuestaDto()
            {
                Token = manejadorToken.WriteToken(token),
                Usuario = _mapper.Map<MostrarTodoUsuarioDto>(usuario)
            };

            // Asigna la lista de roles al DTO
            usuarioLoginRespuestaDto.Usuario.roles = roles.ToList();

            return usuarioLoginRespuestaDto;
        }

        public async Task<MostrarTodoUsuarioDto> registro(UsuarioRegistroDto usuarioRegistroDto)
        {
            Usuario usuario = new Usuario()
            {
                nombre = usuarioRegistroDto.nombre,
                apellidos = usuarioRegistroDto.apellidos,
                Email = usuarioRegistroDto.email,
                NormalizedEmail = usuarioRegistroDto.email.ToUpper(),
                cedula = usuarioRegistroDto.cedula,
                idEmpleado = usuarioRegistroDto.idEmpleado,
                fechaCreacion = DateTime.UtcNow,
                status = usuarioRegistroDto.status.ToUpper(),
                UserName = usuarioRegistroDto.cedula.ToLower()  // Establecer UserName como el correo electrónico
            };

            var result = await _userManager.CreateAsync(usuario, usuarioRegistroDto.password).ConfigureAwait(false);

            if (result.Succeeded)
            {
                // Delegar la lógica de roles al servicio ManejoRoles después de la creación del usuario
                await _manejoRoles.AsignarRolesAsync(usuario, new[] { usuarioRegistroDto.role });

                var usuarioRetornado = _bd.Usuarios.FirstOrDefault(u => u.nombre == usuarioRegistroDto.nombre && u.apellidos == usuarioRegistroDto.apellidos);
                return _mapper.Map<MostrarTodoUsuarioDto>(usuarioRetornado);
            }

            // Resto de tu lógica en caso de fallo...

            return new MostrarTodoUsuarioDto();
        }



        public bool setStatus(Usuario usuario, string status)
        {
            // Convierte el status a minuscula antes de la validación
            string statusUpperCase = status?.ToUpperInvariant();

            // Verifica si el status es "activo" o "inactivo"
            if (statusUpperCase == "ACTIVO" || statusUpperCase == "INACTIVO")
            {
                // Establece el status en mayúsculas
                usuario.status = statusUpperCase;

                // Actualiza el usuario en la base de datos
                _bd.Usuarios.Update(usuario);

                // Guarda los cambios
                return guardar();
            }
            else
            {
                // Lanza una excepción personalizada en caso de status no válido
                throw new ArgumentException("El status proporcionado no es válido.");
            }
        }

        public bool ActualizarUsuario(string cedula, UsuarioActualizarDto usuarioDto)
        {
            var usuario = _bd.Usuarios.FirstOrDefault(u => u.cedula == cedula);

            if (usuario == null)
            {
                return false; // O maneja este caso según tus necesidades
            }

            // Utiliza AutoMapper para mapear solo los campos no nulos
            _mapper.Map(usuarioDto, usuario);

            // Validar y asignar status en mayúsculas si es un valor válido
            if (!string.IsNullOrWhiteSpace(usuarioDto.status))
            {
                string statusUpperCase = usuarioDto.status.ToUpperInvariant();
                if (statusUpperCase == "ACTIVO" || statusUpperCase == "INACTIVO")
                {
                    usuario.status = statusUpperCase;
                }
                else
                {
                    return false;
                }
            }

            // Actualizar el usuario en la base de datos
            _bd.Usuarios.Update(usuario);
            _bd.SaveChanges();

            // Actualizar roles usando ManejoRoles
            if (!string.IsNullOrWhiteSpace(usuarioDto.role))
            {
                _manejoRoles.AsignarRolesAsync(usuario, new[] { usuarioDto.role }).GetAwaiter().GetResult();
            }

            return true;
        }
    }
}
