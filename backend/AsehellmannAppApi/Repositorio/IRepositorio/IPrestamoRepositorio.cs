using AsehellmannAppApi.Modelos;
using AsehellmannAppApi.Modelos.ModeloDto.PrestamoDtos;

namespace AsehellmannAppApi.Repositorio.IRepositorio
{
    public interface IPrestamoRepositorio
    {
        IEnumerable<Prestamo> getAllPrestamos(); //No implementado
        IEnumerable<Prestamo> getPrestamoUsuarioEspecifico(string cedula);
        // IEnumerable<PrestamoAsociado> getPrestamosOrderByCedula(bool incluirRoles = true);
        Prestamo crearPrestamo(CrearPrestamoDto prestamoDto);

        bool tieneAportesSuficientesParaPrestamo(float montoPrestamo, string cedula);  // este metdo consulta si tiene los aportes personales suficientes para optar por un ahorro
        bool borrarPrestamo(Prestamo Prestamo);
        // bool actualizarPrestamo(string cedula, int mes, int anio, ActualizarPrestamoDto PrestamoDto);
        bool actualizarStatus(int idPrestamo, string nuevoStatus);


        bool actualizarCuotaAPagar(int idPrestamo, float cuota);

        PrevisualizarPrestamoDto previsualizarPrestamo(float montoPrestamo, int plazoPrestamo);

     

        bool guardar();
        ////Obtener todos los Prestamos asociados de un usuario. Validar si es el mismo que   IEnumerable<PrestamoAsociado> getByCedula(string cedula); si no borrar.
        //IEnumerable<PrestamoAsociado> getByUsuario(Usuario usuario);
    }
}
