using AsehellmannAppApi.Modelos;
using Microsoft.EntityFrameworkCore;

namespace AsehellmannAppApi.Repositorio.IRepositorio
{
    public class RegistroPagoPrestamoRepositorio : IRegistroPagoPrestamoRepositorio
    {
        private readonly ApplicationDbContext _bd;

        public RegistroPagoPrestamoRepositorio(ApplicationDbContext bd)
        {
            _bd = bd;
        }

        public bool BorrarRegistroPagoPrestamo(RegistroPagoPrestamo RegistroPagoPrestamo)
        {
            throw new NotImplementedException();
        }

        public bool CrearRegistroPagoPrestamo()
        {
            // Obtener todos los ahorros vigentes
            var prestamosVigentes = _bd.Prestamos.Where(a => a.status == "APROBADO").ToList();

            // Crear una lista para almacenar los registros de pago de ahorro
            var registrosPagoPrestamos = new List<RegistroPagoPrestamo>();

            foreach (var prestamo in prestamosVigentes)
            {
                var registroPagoPrestamo = new RegistroPagoPrestamo
                {
                    fechaRegistro = DateTime.Now,
                    montoPrestamoRegistrado = prestamo.cuotaAPagar,
                    idPrestamo = prestamo.idPrestamo
                };

                registrosPagoPrestamos.Add(registroPagoPrestamo);
            }

            // Agregar los registros de pago de ahorro a la base de datos
            _bd.RegistroPagoPrestamos.AddRange(registrosPagoPrestamos);

            // Comprobar si los cambios se guardaron correctamente
            return guardar();
        }


        public ICollection<RegistroPagoPrestamo> getRegistroPagoPrestamos()
        {
            return _bd.RegistroPagoPrestamos
                .Include(r => r.Prestamo) // Cargar la propiedad de navegación Prestamo
                    .ThenInclude(a => a.Usuario) // Cargar la propiedad de navegación Usuario de Prestamo
                .OrderByDescending(u => u.Prestamo.Usuario.apellidos)
                .ToList();
        }



        public IEnumerable<RegistroPagoPrestamo> getRegistroPagoPrestamoUsuarioEspecifico(string cedula)
        {
            return _bd.RegistroPagoPrestamos
            .Include(r => r.Prestamo) // Cargar la propiedad de navegación Prestamo
            .ThenInclude(a => a.Usuario) // Cargar la propiedad de navegación Usuario de Prestamo
            .Where(r => r.Prestamo.Usuario.cedula == cedula) // Filtrar por cédula
            .OrderByDescending(u => u.Prestamo.Usuario.apellidos)
            .ToList();
        }

        public bool guardar()
        {
            return _bd.SaveChanges() >= 0;
        }

        public List<string> ObtenerTiposRegistroPagoPrestamoPorCedula(string cedula)
        {
            throw new NotImplementedException();
        }
    }
}
