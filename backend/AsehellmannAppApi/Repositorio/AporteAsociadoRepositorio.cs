using AsehellmannAppApi.Modelos.ModeloDto.AporteAsociadoDtos;
using AsehellmannAppApi.Repositorio.IRepositorio;
using Microsoft.EntityFrameworkCore;

namespace AsehellmannAppApi.Repositorio
{
    public class AporteAsociadoRepositorio : IAporteAsociadoRepositorio
    {
        private readonly ApplicationDbContext _bd; //Acede BD

        public AporteAsociadoRepositorio(ApplicationDbContext bd)
        {
            _bd = bd;
        }
         public bool actualizarAporte(string cedula, int mes, int anio, ActualizarAporteDto aporteDto)
         {
            // Buscar el usuario
            var usuario = _bd.Usuarios.FirstOrDefault(u => u.cedula == cedula);
            if (usuario == null)
            {
                return false;
            }

            // Buscar el aporte asociado con el usuario, mes y año
            var aporte = _bd.AportesAsociados
                .FirstOrDefault(a => a.UsuarioId == usuario.Id && a.fechaDelAporte.Month == mes && a.fechaDelAporte.Year == anio);

            if (aporte == null)
            {
                return false;
            }

            // Actualizar los atributos del aporte con los valores del DTO
            aporte.aportePatronal = aporteDto.aportePatronal;
            aporte.aportePersonal = aporteDto.aportePersonal;
            return guardar();
         }

        public bool borrarAporte(BuscarAporteAsociadoDto aporteDto)
        {
            // Buscar el usuario
            var usuario = _bd.Usuarios.FirstOrDefault(u => u.cedula == aporteDto.cedula);
            if (usuario == null)
            {
                return false; // No se encontró el usuario
            }

            // Buscar el aporte asociado del usuario para el mes y año especificados
            var aporte = _bd.AportesAsociados
                .Where(a => a.UsuarioId == usuario.Id)
                .Where(a => a.fechaDelAporte.Year == aporteDto.anio && a.fechaDelAporte.Month == aporteDto.mes)
                .FirstOrDefault();

            if (aporte == null)
            {
                return false; // No se encontró un aporte para el usuario en el mes y año especificados
            }

            // Eliminar el aporte asociado
            _bd.AportesAsociados.Remove(aporte);
            return guardar(); // Guardar los cambios en la base de datos
        }


        public IEnumerable<AporteAsociado> getAllOrderMonth()
        {
            throw new NotImplementedException();
        }

        public IEnumerable<AporteAsociado> getAportesOrderByCedula()
        {
            return _bd.AportesAsociados
            .Include(a => a.Usuario) // Cargar la propiedad de navegación Usuario
            .OrderByDescending(u => u.Usuario.cedula)
            .ToList();
        }
      

        public IEnumerable<AporteAsociado> getAporteUsuarioEspecifico(string cedula)
        {
            return _bd.AportesAsociados
                .Include(a => a.Usuario) // Cargar la propiedad de navegación Usuario
                .Where(a => a.Usuario.cedula == cedula) // Filtrar por la cédula
                .ToList();
        }
        public bool crearAporte(CrearAporteAsociadoDto aporteDto)
        {
            var usuario = _bd.Usuarios.FirstOrDefault(u => u.cedula == aporteDto.cedula);
            if (usuario == null)
            {
                return false;
            }

            // Obtener el último aporte del usuario
            var ultimoAporte = _bd.AportesAsociados
                .Where(a => a.UsuarioId == usuario.Id)
                .OrderByDescending(a => a.fechaDelAporte)
                .FirstOrDefault();

            int aportePersonalAcumulado = 0;
            int aportePatronalAcumulado = 0;

            if (ultimoAporte != null)
            {
                // Utilizar los acumulados del último aporte sin sumar el valor actual del aporte
                aportePersonalAcumulado = ultimoAporte.aportePersonalesAcumulado;
                aportePatronalAcumulado = ultimoAporte.aportePatronalesAcumulado;
            }

            AporteAsociado aporte = new AporteAsociado
            {
                Usuario = usuario,
                // Asignar otros valores de aporte según aporteDTO
                aportePersonal = aporteDto.aportePersonal,
                aportePatronal = aporteDto.aportePatronal,

                // Asignar fecha si es necesario
                fechaDelAporte = new DateTime(aporteDto.anio, aporteDto.mes, 1),
                fechaCreacionAporte = DateTime.Now,

                // Sumar el valor actual del aporte a los acumulados del último aporte
                aportePersonalesAcumulado = aportePersonalAcumulado + aporteDto.aportePersonal,
                aportePatronalesAcumulado = aportePatronalAcumulado + aporteDto.aportePatronal

            };

            _bd.AportesAsociados.Add(aporte);
            

            return guardar(); // _bd.SaveChanges() >= 0;
        }


        public bool usuarioAporteLigadoMes(string cedula, int mes, int anio)
        {
            // Verifica si el usuario ya tiene un aporte asociado en el mes y año especificados
            bool aporteExistente = _bd.AportesAsociados
                .Include(a => a.Usuario)
                .Any(a => a.Usuario.cedula == cedula &&
                          a.fechaDelAporte.Month == mes &&
                          a.fechaDelAporte.Year == anio);

            return aporteExistente;
        }

        public bool guardar()
        {
            return _bd.SaveChanges() >= 0;
        }

        public bool restarMontoDelPrestamoDelAportePersonal(string cedula, int monto)
        {
            var usuario = _bd.Usuarios.FirstOrDefault(u => u.cedula == cedula);
            if (usuario == null)
            {
                return false;
            }

            // Obtener el último aportePersonalesAcumulados
            var ultimoAporte = _bd.AportesAsociados
                .Where(a => a.UsuarioId == usuario.Id)
                .OrderByDescending(a => a.fechaDelAporte)
                .FirstOrDefault();

            if (ultimoAporte != null)
            {
                // Restar el monto del préstamo al último aporte acumulado
                ultimoAporte.aportePersonalesAcumulado -= monto;

                // Guardar los cambios en la base de datos
                _bd.SaveChanges();

                return true;
            }
            else
            {
                return false; // No se encontraron aportes para este usuario.
            }
        }

    }

}
