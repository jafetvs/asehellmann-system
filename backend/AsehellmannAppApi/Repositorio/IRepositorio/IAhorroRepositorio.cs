using AsehellmannAppApi.Modelos;
using AsehellmannAppApi.Modelos.ModeloDto.AhorrosDtos;
using DocumentFormat.OpenXml.Drawing;

namespace AsehellmannAppApi.Repositorio.IRepositorio
{
    public interface IAhorroRepositorio
    {
        ICollection<Ahorro> getAhorros();
        IEnumerable<Ahorro> getAhorroUsuarioEspecifico(string cedula);
        bool crearAhorro(CrearAhorroDto Ahorro);

        List<string> obtenerTiposAhorroPorCedula(string cedula);

        bool actualizarAhorroMontoDebitar(int idAhorro, int monto);

        bool actualizarStatusVigente(int idAhorro, string nuevoStatus);

        public bool existeAhorroActivoSegunStatus(int idAhorro);

        public bool actualizarStausCerrado(int idAhorro);

        public bool actualizarStausTerminado(int idAhorro);
        bool borrarAhorro(Ahorro Ahorro);
        bool guardar();
    }
}
