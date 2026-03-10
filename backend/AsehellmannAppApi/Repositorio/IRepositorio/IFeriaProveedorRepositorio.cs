using AsehellmannAppApi.Modelos;
using AsehellmannAppApi.Modelos.ModeloDto.FeriaProveedor;

namespace AsehellmannAppApi.Repositorio.IRepositorio
{
    public interface IFeriaProveedorRepositorio
    {
        IEnumerable<FeriaProveedor> getFeriaProveedores();
        List<FeriaProveedor> getFeriaProveedores(string nombre);

        bool crearFeriaProveedor(FeriaProveedor FeriaProveedor);

        bool actualizarFeriaProveedor(FeriaProveedor FeriaProveedor);

       // bool existeFeriaProveedor(int id);    //Nombre

        bool guardar();
    }
}
