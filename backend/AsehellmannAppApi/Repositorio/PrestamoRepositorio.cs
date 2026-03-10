using AsehellmannAppApi.Modelos;
using AsehellmannAppApi.Modelos.ModeloDto.PrestamoDtos;
using AsehellmannAppApi.Repositorio.IRepositorio;
using DocumentFormat.OpenXml.Office2013.Drawing.ChartStyle;
using Microsoft.EntityFrameworkCore;

namespace AsehellmannAppApi.Repositorio
{
    public class PrestamoRepositorio : IPrestamoRepositorio
    {
        public readonly ApplicationDbContext _bd;
        public readonly IAporteAsociadoRepositorio _repoAporteAsociado;

        public PrestamoRepositorio(ApplicationDbContext bd, IAporteAsociadoRepositorio repoAporteAsociado)
        {
            _bd = bd;
            _repoAporteAsociado = repoAporteAsociado;
        }

        public bool actualizarCuotaAPagar(int idPrestamo, float cuotaPagar)
        {
            var prestamo = _bd.Prestamos.FirstOrDefault(a => a.idPrestamo == idPrestamo);
            if (prestamo == null) { return false; }

            prestamo.cuotaAPagar = cuotaPagar;
            guardar();
            return true;
        }

        public bool actualizarStatus(int idPrestamo, string nuevoStatus)
        {
            var prestamo = _bd.Prestamos.FirstOrDefault(a => a.idPrestamo == idPrestamo);
            if (prestamo == null) { return false; }

            // Verificar si el nuevo status es válido
            if (nuevoStatus != "APROBADO" && nuevoStatus != "TERMINADO" && nuevoStatus != "RECHAZADO")
            {
                // El nuevo status no es válido, retornar false
                return false;
            }

            // Actualizar el status del préstamo con el valor proporcionado
            prestamo.status = nuevoStatus;

            // Guardar los cambios en la base de datos (suponiendo que _bd es el contexto de la base de datos)
            guardar();

            return true;
        }


        public bool borrarPrestamo(Prestamo Prestamo)
        {
            throw new NotImplementedException();
        }

       
        public Prestamo crearPrestamo(CrearPrestamoDto crearPrestamoDto)
        {
            // Verificar si el usuario tiene aportes suficientes para el préstamo
            if (!tieneAportesSuficientesParaPrestamo(crearPrestamoDto.montoPrestamo, crearPrestamoDto.cedula))
            {
                return null; // Retorna null si el usuario no tiene aportes suficientes
            }

            // Busca al usuario en la base de datos
            var usuario = _bd.Usuarios.FirstOrDefault(u => u.cedula == crearPrestamoDto.cedula);

            // Verifica si el usuario existe
            if (usuario != null)
            {
                // Crea una nueva instancia de Prestamo
                Prestamo prestamo = new Prestamo(usuario, crearPrestamoDto.tipoPrestamo, crearPrestamoDto.montoPrestamo, usuario.Id, crearPrestamoDto.plazoPrestamo, "APROBADO");

                // Agrega el préstamo a la base de datos
                _bd.Prestamos.Add(prestamo);

                //Resta el valor del prestamo a los aportes de asociado acomulados
                _repoAporteAsociado.restarMontoDelPrestamoDelAportePersonal(usuario.cedula,crearPrestamoDto.montoPrestamo);

                // Guarda los cambios en la base de datos
                guardar();

                return prestamo;
            }
            else
            {
                return null; // Retorna null si el usuario no existe
            }
        }



        public IEnumerable<Prestamo> getAllPrestamos()
        {
            return _bd.Prestamos
                .Include(a=> a.Usuario)
                .OrderByDescending(u=> u.Usuario.cedula)
                .ToList();
        }

       

        public IEnumerable<Prestamo> getPrestamoUsuarioEspecifico(string cedula)
        {
            var pretamoUsuario = _bd.Prestamos
            .Include(a => a.Usuario) // Cargar la propiedad de navegación Usuario
            .Where(a => a.Usuario.cedula == cedula)
            .ToList();

            return pretamoUsuario;
        }

        public bool guardar()
        {
            return _bd.SaveChanges() >= 0;
        }

        public PrevisualizarPrestamoDto previsualizarPrestamo(float montoPrestamo, int plazoPrestamo)
        {
            // Calcula los detalles del préstamo utilizando los parámetros proporcionados
            float intereses = 0.20f; // 20% de interés anual, puedes ajustarlo según tus requisitos

            // Crear una instancia de Prestamo para calcular la cuota a pagar
            Prestamo prestamo = new Prestamo();

            // Lista para almacenar cada fila de la tabla de previsualización del préstamo
            List<PrevisualizarPrestamoRowDto> rows = new List<PrevisualizarPrestamoRowDto>();

            // Calcula los detalles para cada mes del préstamo y agrégalos a la lista
            for (int mes = 1; mes <= plazoPrestamo; mes++)
            {
                float cuotaAPagar = prestamo.redondeo(prestamo.CalculoCuotaAPagar(montoPrestamo, intereses, plazoPrestamo));

                float saldoPrestamo = montoPrestamo;
                float saldoFinal = saldoPrestamo; // Inicialmente igual al saldo del préstamo

                // Calcula los detalles para el mes actual
                for (int i = 1; i <= mes; i++)
                {
                    float interesMes = saldoFinal * (intereses / 12);
                    float principalMes = cuotaAPagar - interesMes;
                    saldoFinal -= principalMes;
                }

                // Verifica si el saldo final es negativo y omite el último mes si es así
                if (saldoFinal < 0)
                {
                    break;
                }

                // Agrega una fila a la lista con los detalles del mes actual
                rows.Add(new PrevisualizarPrestamoRowDto
                {
                    mes = mes,
                    saldoPrestamo = saldoFinal,
                    cuotaPagar = cuotaAPagar,
                    principal = cuotaAPagar - (saldoFinal * (intereses / 12)),
                    intereses = saldoFinal * (intereses / 12),
                    saldoFinal = saldoFinal
                });
            }

            // Crea el DTO de previsualización del préstamo con las filas calculadas
            PrevisualizarPrestamoDto dto = new PrevisualizarPrestamoDto
            {
                montoPrestamo = montoPrestamo,
                plazoPrestamo = rows.Count, // Actualiza el plazo del préstamo según la cantidad de filas generadas
                detalles = rows
            };

            return dto;
        }




        public bool tieneAportesSuficientesParaPrestamo(float montoPrestamo, string cedula)
        {
            
            //Máximo disponible de aportes requeridos para optar por un préstamo
            var aportePersonalDisponible = _bd.AportesAsociados
                                            .Include(a => a.Usuario)
                                            .Where(a => a.Usuario.cedula == cedula )
                                            .OrderByDescending(a => a.fechaDelAporte)
                                            .Select(a => a.aportePersonalesAcumulado)
                                            .FirstOrDefault();
           
            // Verificar si los aportes personales son suficientes
            return aportePersonalDisponible >= montoPrestamo;
        }

        
    }
}
