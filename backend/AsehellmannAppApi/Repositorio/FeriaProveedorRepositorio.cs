using AsehellmannAppApi.Modelos;
using AsehellmannAppApi.Modelos.ModeloDto.FeriaProveedor;
using AsehellmannAppApi.Repositorio.IRepositorio;

namespace AsehellmannAppApi.Repositorio
{
    public class FeriaProveedorRepositorio : IFeriaProveedorRepositorio
    {

        private readonly ApplicationDbContext _bd; // Para poder acceder a la base de datos

        public FeriaProveedorRepositorio(ApplicationDbContext bd, IConfiguration config)
        {
            _bd = bd;
        }

        public bool actualizarFeriaProveedor(FeriaProveedor feriaProveedor)
        {
            _bd.FeriaProveedores.Update(feriaProveedor);
            return guardar();
        }

        public bool crearFeriaProveedor(FeriaProveedor FeriaProveedor)
        {
            _bd.Add(FeriaProveedor);
            return guardar();
        }

        public List<FeriaProveedor> getFeriaProveedores(string nombre)
        {
            return _bd.FeriaProveedores.Where(u => u.nombreProveedor.Contains(nombre)).ToList();
        }


        public IEnumerable<FeriaProveedor> getFeriaProveedores()
        {
            return _bd.FeriaProveedores.OrderBy(u => u.nombreProveedor).ToList();
        }


        public bool guardar()
        {
            return _bd.SaveChanges() >= 0;
        }
    }
}
