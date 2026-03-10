using AsehellmannAppApi.Modelos.ModeloDto.UsuarioDtos;
using AsehellmannAppApi.Repositorio.IRepositorio;
using AutoMapper;
using Microsoft.AspNetCore.Identity;

namespace AsehellmannAppApi.Repositorio
{
    public class ManejoRoles : IManejoRoles
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<Usuario> _userManager;
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _bd;
        private readonly IConfiguration _config;
        public ManejoRoles(ApplicationDbContext bd, IConfiguration config,
            UserManager<Usuario> userManager, RoleManager<IdentityRole> roleManager, IMapper mapper)
        {
            _bd = bd;
            _roleManager = roleManager;
            _userManager = userManager;
            _mapper = mapper;
            _config = config; // Agregando inyección de IConfiguration

        }

        public async Task<bool> AsignarRolesAsync(Usuario usuario, IEnumerable<string> roles)
        {
            // Verificar y crear el rol si no existe
            foreach (var roleName in roles)
            {
                // Verificar si el rol existe
                if (!await _roleManager.RoleExistsAsync(roleName))
                {
                    // El rol no existe, intentar crearlo
                    var createRoleResult = await verificarYCrearRolAsync(roleName);

                    if (!createRoleResult)
                    {
                        // Manejar el error en la creación del rol
                        return false;
                    }
                }
            }

            // Asignar el usuario a los roles especificados
            var result = await _userManager.AddToRolesAsync(usuario, roles);

            // Devolver true si la asignación de roles fue exitosa
            return result.Succeeded;
        }


        public async Task<MostrarTodoUsuarioDto> ObtenerUsuarioDtoConRolesAsync(string userId)
        {
            var usuario = await _bd.Usuarios.FindAsync(userId);

            if (usuario == null)
            {
                return null; // Maneja este caso según tus necesidades
            }

            var usuarioDto = _mapper.Map<MostrarTodoUsuarioDto>(usuario);

            // Obtener roles del usuario
            var roles = await _userManager.GetRolesAsync(usuario);

            // Asignar roles al DTO
            usuarioDto.roles = roles.ToList();

            return usuarioDto;
        }

        public async Task<bool> QuitarRolesAsync(Usuario usuario, IEnumerable<string> roles)
        {
            // Quitar el usuario de los roles especificados
            var result = await _userManager.RemoveFromRolesAsync(usuario, roles);

            // Devolver true si la eliminación de roles fue exitosa
            return result.Succeeded;
        }

        public async Task<bool> verificarYCrearRolAsync(string roleName)
        {
            if (!await _roleManager.RoleExistsAsync(roleName))
            {
                // El rol no existe, créalo
                var newRole = new IdentityRole(roleName);
                var createRoleResult = await _roleManager.CreateAsync(newRole);

                if (!createRoleResult.Succeeded)
                {
                    // Manejar el error en la creación del rol
                    return false;
                }
            }

            return true;
        }

        public async Task<MostrarTodoUsuarioDto> ObtenerUsuarioDtoConRolesAsync(string userId, bool incluirRoles = true)
        {
            var usuario = incluirRoles
                ? await _userManager.FindByIdAsync(userId) // Cargar roles solo si se especifica
                : await _bd.Usuarios.FindAsync(userId); // Cargar sin roles

            if (usuario == null)
            {
                return null; // Maneja este caso según tus necesidades
            }

            var usuarioDto = _mapper.Map<MostrarTodoUsuarioDto>(usuario);

            if (incluirRoles)
            {
                // Obtener roles del usuario
                var roles = await _userManager.GetRolesAsync(usuario);

                // Asignar roles al DTO
                usuarioDto.roles = roles.ToList();
            }

            return usuarioDto;
        }



    }
}
