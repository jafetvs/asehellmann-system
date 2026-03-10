using AsehellmannAppApi.Modelos;
using Microsoft.EntityFrameworkCore;

namespace AsehellmannAppApi.Repositorio.IRepositorio
{
    public class RegistroPagoAhorroRepositorio : IRegistroPagoAhorroRepositorio
    {
        private readonly ApplicationDbContext _bd;

        public RegistroPagoAhorroRepositorio(ApplicationDbContext bd)
        {
            _bd = bd;
        }
        public bool ActualizarRegistroPagoAhorroMontoDebitar(string ceduala, int monto, string tipoRegistroPagoAhorro)
        {
            throw new NotImplementedException();
        }

        public bool BorrarRegistroPagoAhorro(RegistroPagoAhorro RegistroPagoAhorro)
        {
            throw new NotImplementedException();
        }

        public bool CrearRegistroPagoAhorro()
        {
            // Obtener todos los ahorros vigentes
            var ahorrosVigentes = _bd.Ahorros.Where(a => a.status == "VIGENTE").ToList();

            // Crear una lista para almacenar los registros de pago de ahorro
            var registrosPagoAhorros = new List<RegistroPagoAhorro>();

            foreach (var ahorro in ahorrosVigentes)
            {
                var registroPagoAhorro = new RegistroPagoAhorro
                {
                    fechaRegistro = DateTime.Now,
                    montoAhorroRegistrado = ahorro.montoDebitar,
                    idAhorro = ahorro.idAhorro
                };

                registrosPagoAhorros.Add(registroPagoAhorro);
            }

            // Agregar los registros de pago de ahorro a la base de datos
            _bd.RegistroPagoAhorros.AddRange(registrosPagoAhorros);

            // Guardar los cambios en la base de datos
            var cambiosGuardados = _bd.SaveChanges();

            // Comprobar si los cambios se guardaron correctamente
            return guardar();
        }

        public ICollection<RegistroPagoAhorro> getRegistroPagoAhorros()
        {
            return _bd.RegistroPagoAhorros
                .Include(r => r.Ahorro) // Cargar la propiedad de navegación Ahorro
                    .ThenInclude(a => a.Usuario) // Cargar la propiedad de navegación Usuario de Ahorro
                .OrderByDescending(u => u.Ahorro.Usuario.apellidos)
                .ToList();
        }



        public IEnumerable<RegistroPagoAhorro> getRegistroPagoAhorroUsuarioEspecifico(string cedula)
        {
            return _bd.RegistroPagoAhorros
            .Include(r => r.Ahorro) // Cargar la propiedad de navegación Ahorro
            .ThenInclude(a => a.Usuario) // Cargar la propiedad de navegación Usuario de Ahorro
            .Where(r => r.Ahorro.Usuario.cedula == cedula) // Filtrar por cédula
            .OrderByDescending(u => u.Ahorro.Usuario.apellidos)
            .ToList();
        }

        public bool guardar()
        {
            return _bd.SaveChanges() >= 0;
        }

        public List<string> ObtenerTiposRegistroPagoAhorroPorCedula(string cedula)
        {
            throw new NotImplementedException();
        }
    }
}
