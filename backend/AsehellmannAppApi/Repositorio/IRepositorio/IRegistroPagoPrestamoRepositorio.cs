using AsehellmannAppApi.Modelos;

namespace AsehellmannAppApi.Repositorio.IRepositorio
{
    public interface IRegistroPagoPrestamoRepositorio
    {
        ICollection<RegistroPagoPrestamo> getRegistroPagoPrestamos();
        IEnumerable<RegistroPagoPrestamo> getRegistroPagoPrestamoUsuarioEspecifico(string cedula);
        bool CrearRegistroPagoPrestamo();

        List<string> ObtenerTiposRegistroPagoPrestamoPorCedula(string cedula);

        //bool ActualizarStatus(string cedula, string tipoRegistroPagoPrestamo, string nuevoStatus);
        bool BorrarRegistroPagoPrestamo(RegistroPagoPrestamo RegistroPagoPrestamo);
        bool guardar();
    }
}
