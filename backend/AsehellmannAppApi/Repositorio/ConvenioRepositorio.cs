using AsehellmannAppApi.Repositorio.IRepositorio;

namespace AsehellmannAppApi.Repositorio
{
    public class ConvenioRepositorio : IConvenioRepositorio
    {
        private readonly ApplicationDbContext _bd; // Para poder acceder a la base de datos

        public ConvenioRepositorio(ApplicationDbContext bd, IConfiguration config)
        {
            _bd = bd;
        }

        public bool actualizarConvenio(Convenio convenio)
        {
            _bd.Convenios.Update(convenio);
            return guardar();
        }

        public bool crearConvenio(Convenio convenio)
        {
            _bd.Add(convenio);  
            return guardar();
        }

        public bool existeConvenio(int id)
        {
            return _bd.Convenios.Any(c =>c.Id == id);
        }

        public Convenio getConvenio(int id)
        {
            return _bd.Convenios.FirstOrDefault(u => u.Id == id);
        }

        public IEnumerable<Convenio> getConvenios()
        {
            return _bd.Convenios.OrderBy(u => u.Id).ToList();
        }

        public IEnumerable<Convenio> getConveniosActivos()
        {
            return _bd.Convenios.OrderBy(u => u.Id)
                .Where(u=> u.status =="activo")
                .ToList();
        }

        public bool guardar()
        {
            return _bd.SaveChanges() >= 0;
        }

        public bool setStatusInactivo(Convenio convenio)
        {
            convenio.status = "inactivo";
            _bd.Convenios.Update(convenio);
            return guardar();
        }
    }
}