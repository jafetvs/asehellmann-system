using AsehellmannAppApi.Modelos;
using AsehellmannAppApi.Modelos.ModeloDto.AhorrosDtos;
using AsehellmannAppApi.Repositorio.IRepositorio;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata.Ecma335;

namespace AsehellmannAppApi.Repositorio
{
    public class AhorroRepositorio : IAhorroRepositorio
    {
        private readonly ApplicationDbContext _bd; //Accede a la bd
                                                   
        // Propiedad pública para acceder al contexto
        public ApplicationDbContext Context => _bd;
        public AhorroRepositorio(ApplicationDbContext bd)
        {
            _bd = bd;
        }

        public bool actualizarAhorroMontoDebitar(int idAhorro, int monto)
        {

            var ahorro = _bd.Ahorros
                .FirstOrDefault(a => a.idAhorro == idAhorro);

            if (ahorro == null) { return false; }

            // Actualizar los atributos del aporte con los valores adjuntados
            ahorro.montoDebitar = monto;
            return guardar();
        }

        public bool actualizarStatusVigente(int idAhorro, string nuevoStatus)
        {
            // Buscar el ahorro asociado al usuario y al tipo de ahorro proporcionados
            var ahorro = _bd.Ahorros.FirstOrDefault(a => a.idAhorro == idAhorro);
            if (ahorro == null)
            {
                return false;
            }

            // Verificar si el nuevo estado es válido
            if (nuevoStatus != "VIGENTE" && nuevoStatus != "CERRADO" && nuevoStatus != "TERMINADO")
            {
                return false;
            }

            // Actualizar el estado del ahorro
            ahorro.status = nuevoStatus;

            return guardar(); // Guardar los cambios en la base de datos y devolver el resultado
        }


        public bool borrarAhorro(Ahorro Ahorro)
        {
            throw new NotImplementedException();
        }

        public bool crearAhorro(CrearAhorroDto crearAhorro)
        {
            // Busca al usuario en la base de datos
            var usuario = _bd.Usuarios.FirstOrDefault(u => u.cedula == crearAhorro.cedula);

            // Verifica si el usuario existe
            if (usuario != null)
            {

                Ahorro ahorro = new Ahorro(usuario, crearAhorro.tipoAhorro, crearAhorro.montoDebitar, crearAhorro.fechaInicio);

                // Agrega el ahorro a la base de datos
                _bd.Ahorros.Add(ahorro);

                // Guarda los cambios en la base de datos
                return guardar();
            }
            else
            {
                // Retorna false si el usuario no existe
                return false;
            }
        }
        public bool actualizarStausCerrado(int idAhorro)
        {
            var ahorroEspecifico = _bd.Ahorros.FirstOrDefault(a => a.idAhorro == idAhorro);

            if (ahorroEspecifico == null)
            {
                // Manejar el caso en que no se encuentra el ahorro específico
                return false;
            }
            ahorroEspecifico.status = "CERRADO";
            _bd.SaveChanges();
            return true;
        }

        public bool actualizarStausTerminado(int idAhorro)
        {
            var ahorroEspecifico = _bd.Ahorros.FirstOrDefault(a => a.idAhorro == idAhorro);

            if (ahorroEspecifico == null)
            {
                // Manejar el caso en que no se encuentra el ahorro específico
                return false;
            }
            ahorroEspecifico.status = "TERMINADO";
            _bd.SaveChanges();
            return true;
        }


        public bool existeAhorroActivoSegunStatus(int idAhorro)
        {
            // Obtener el ahorro específico proporcionado por idAhorro
            var ahorroEspecifico = _bd.Ahorros.FirstOrDefault(a => a.idAhorro == idAhorro);

            if (ahorroEspecifico == null)
            {
                // Manejar el caso en que no se encuentra el ahorro específico
                return false;
            }

            // Obtener el tipo de ahorro del ahorro específico proporcionado por idAhorro
            var tipoAhorro = ahorroEspecifico.tipoAhorro;

            // Obtener el ID del usuario del ahorro proporcionado
            var idUsuario = ahorroEspecifico.UsuarioId;

            // Verificar si existe al menos otro ahorro con el status vigente para el usuario correspondiente
            var existeAhorroVigente = _bd.Ahorros.Any(a =>
                a.tipoAhorro == tipoAhorro &&
                a.status == "VIGENTE" &&
                a.idAhorro != idAhorro &&
                a.UsuarioId == idUsuario
            );

            return existeAhorroVigente;
        }



        public ICollection<Ahorro> getAhorros()
        {
            return _bd.Ahorros
           .Include(a => a.Usuario) // Cargar la propiedad de navegación Usuario
           .OrderByDescending(u => u.Usuario.apellidos)
           .ToList();
        }

        public IEnumerable<Ahorro> getAhorroUsuarioEspecifico(string cedula)
        {
            var ahorrosUsuario = _bd.Ahorros
            .Include(a => a.Usuario) // Cargar la propiedad de navegación Usuario
            .Where(a => a.Usuario.cedula == cedula)
            .ToList();

            return ahorrosUsuario;
        }

        public bool guardar()
        {
            return _bd.SaveChanges() >= 0;
        }

        public List<string> obtenerTiposAhorroPorCedula(string cedula)
        {
            // Buscar al usuario por su cédula
            var usuario = _bd.Usuarios.FirstOrDefault(u => u.cedula == cedula);

            // Si no se encuentra al usuario, retornar una lista vacía
            if (usuario == null)
            {
                return new List<string>();
            }

            // Obtener los tipos de ahorro asociados a ese usuario
            var tiposAhorro = _bd.Ahorros
                                .Where(a => a.UsuarioId == usuario.Id && a.status == "VIGENTE")
                                .Select(a => a.tipoAhorro)
                                .Distinct()
                                .ToList();
            return tiposAhorro;
        }

    }
}
