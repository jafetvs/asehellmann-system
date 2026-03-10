using AsehellmannAppApi.Modelos;

namespace AsehellmannAppApi.Repositorio.IRepositorio
{
    public interface IRegistroPagoAhorroRepositorio
    {
        ICollection<RegistroPagoAhorro> getRegistroPagoAhorros();
        IEnumerable<RegistroPagoAhorro> getRegistroPagoAhorroUsuarioEspecifico(string cedula);
        bool CrearRegistroPagoAhorro();

        List<string> ObtenerTiposRegistroPagoAhorroPorCedula(string cedula);

        bool ActualizarRegistroPagoAhorroMontoDebitar(string ceduala, int monto, string tipoRegistroPagoAhorro);

        //bool ActualizarStatus(string cedula, string tipoRegistroPagoAhorro, string nuevoStatus);
        bool BorrarRegistroPagoAhorro(RegistroPagoAhorro RegistroPagoAhorro);
        bool guardar();
    }
}
