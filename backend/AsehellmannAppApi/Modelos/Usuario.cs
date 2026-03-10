using AsehellmannAppApi.Modelos;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

public class Usuario : IdentityUser
{
    public int idEmpleado { get; set; }
    public string nombre { get; set; }
    public string apellidos { get; set; }
    public DateTime fechaCreacion { get; set; }

    [Required]
    public string cedula { get; set; }

    public string status { get; set; }

    // Propiedades de navegación
    public virtual ICollection<AporteAsociado> AportesAsociados { get; set; }
    public virtual ICollection<Ahorro> Ahorros { get; set; }
    public virtual ICollection<Prestamo> Prestamos { get; set; }

    public virtual ICollection<RegistroPagoFeria> RegistroPagoFerias { get; set; }
}


/*
public override bool Equals(object obj)
{
    return obj is Usuario usuario &&
           id == usuario.id &&
           cedula == usuario.cedula &&
           idEmpleado == usuario.idEmpleado &&
           nombre == usuario.nombre &&
           apellidos == usuario.apellidos &&
           correo == usuario.correo &&
           password == usuario.password &&
           fechaCreacion == usuario.fechaCreacion &&
           rol == usuario.rol &&
           status == usuario.status;
}
*/


