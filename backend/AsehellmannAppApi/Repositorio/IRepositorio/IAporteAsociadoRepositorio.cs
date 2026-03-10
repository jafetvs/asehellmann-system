using AsehellmannAppApi.Modelos.ModeloDto.AporteAsociadoDtos;

namespace AsehellmannAppApi.Repositorio.IRepositorio
{
    public interface IAporteAsociadoRepositorio
    {
        IEnumerable<AporteAsociado> getAportesOrderByCedula();

        //IEnumerable<AporteAsociado> getAporteOrderByUserId();
        IEnumerable<AporteAsociado> getAllOrderMonth(); //No implementado
        IEnumerable<AporteAsociado> getAporteUsuarioEspecifico(string cedula);
        // IEnumerable<AporteAsociado> getAportesOrderByCedula(bool incluirRoles = true);
        bool crearAporte(CrearAporteAsociadoDto aporteDto);
        bool borrarAporte(BuscarAporteAsociadoDto aporte);
        bool actualizarAporte(string cedula, int mes, int anio, ActualizarAporteDto aporteDto);
        bool restarMontoDelPrestamoDelAportePersonal(string cedula, int monto);
        bool usuarioAporteLigadoMes(string cedula, int mes, int anio);
        bool guardar();
        ////Obtener todos los aportes asociados de un usuario. Validar si es el mismo que   IEnumerable<AporteAsociado> getByCedula(string cedula); si no borrar.
        //IEnumerable<AporteAsociado> getByUsuario(Usuario usuario);
    }
}
