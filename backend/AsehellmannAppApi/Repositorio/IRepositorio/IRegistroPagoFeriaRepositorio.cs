using AsehellmannAppApi.Modelos;
using System.Collections.Generic;

namespace AsehellmannAppApi.Repositorio.IRepositorio
{
    public interface IRegistroPagoFeriaRepositorio
    {
        ICollection<RegistroPagoFeria> ObtenerTodosLosRegistrosPagoFeria();
        RegistroPagoFeria ObtenerRegistroPagoFeriaPorId(int id);
        IEnumerable<RegistroPagoFeria> ObtenerRegistrosPagoFeriaPorUsuario(string cedula);
        bool CrearRegistroPagoFeria(RegistroPagoFeria registroPagoFeria);
        bool ActualizarRegistroPagoFeria(RegistroPagoFeria registroPagoFeria);
        bool BorrarRegistroPagoFeria(int id);
        bool Guardar();
    }
}
