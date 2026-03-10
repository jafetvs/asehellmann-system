using AsehellmannAppApi.Modelos;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AsehellmannAppApi.Repositorio.IRepositorio
{
    public class RegistroPagoFeriaRepositorio : IRegistroPagoFeriaRepositorio
    {
        private readonly ApplicationDbContext _bd;

        public RegistroPagoFeriaRepositorio(ApplicationDbContext bd)
        {
            _bd = bd;
        }

        public bool CrearRegistroPagoFeria(RegistroPagoFeria registroPagoFeria)
        {
            _bd.RegistroPagoFerias.Add(registroPagoFeria);
            return Guardar();
        }

        public RegistroPagoFeria ObtenerRegistroPagoFeriaPorId(int id)
        {
            return _bd.RegistroPagoFerias
                .Include(r => r.FeriaProveedor)
                .Include(r => r.Usuario)
                .FirstOrDefault(r => r.Id == id);
        }

        public ICollection<RegistroPagoFeria> ObtenerTodosLosRegistrosPagoFeria()
        {
            return _bd.RegistroPagoFerias
                .Include(r => r.FeriaProveedor)
                .Include(r => r.Usuario)
                .OrderByDescending(r => r.FechaCompra)
                .ToList();
        }

        public IEnumerable<RegistroPagoFeria> ObtenerRegistrosPagoFeriaPorUsuario(string cedula)
        {
            return _bd.RegistroPagoFerias
                .Include(r => r.FeriaProveedor)
                .Include(r => r.Usuario)
                .Where(r => r.UsuarioCedula == cedula)
                .OrderByDescending(r => r.FechaCompra)
                .ToList();
        }

        public bool ActualizarRegistroPagoFeria(RegistroPagoFeria registroPagoFeria)
        {
            _bd.RegistroPagoFerias.Update(registroPagoFeria);
            return Guardar();
        }

        public bool BorrarRegistroPagoFeria(int id)
        {
            var registroPagoFeria = ObtenerRegistroPagoFeriaPorId(id);
            if (registroPagoFeria != null)
            {
                _bd.RegistroPagoFerias.Remove(registroPagoFeria);
                return Guardar();
            }
            return false;
        }

        public bool Guardar()
        {
            return _bd.SaveChanges() >= 0;
        }
    }
}
