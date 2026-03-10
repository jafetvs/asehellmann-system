using AsehellmannAppApi.Modelos.ModeloDto;

namespace AsehellmannAppApi.Repositorio.IRepositorio
{
    public interface IConvenioRepositorio
    {
        IEnumerable<Convenio> getConvenios();
        Convenio getConvenio(int id); 

        bool crearConvenio (Convenio convenio);

        bool actualizarConvenio(Convenio convenio);

        bool existeConvenio (int id);    //Nombre


        bool setStatusInactivo(Convenio convenio);

        IEnumerable<Convenio> getConveniosActivos();

        bool guardar();
    }
}
