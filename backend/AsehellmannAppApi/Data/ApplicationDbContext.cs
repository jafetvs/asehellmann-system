using AsehellmannAppApi.Modelos;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using XAct.Library.Settings;

public class ApplicationDbContext : IdentityDbContext<Usuario>
{
    public ApplicationDbContext()
    {
    }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {

    }
    //Agregar los modelos
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<AporteAsociado> AportesAsociados { get; set; }
    public DbSet<Convenio> Convenios { get; set; }

    public DbSet<Ahorro> Ahorros { get; set; }

    public DbSet<RegistroPagoAhorro> RegistroPagoAhorros { get; set; }

    public DbSet<Prestamo> Prestamos { get; set; }

    public DbSet<RegistroPagoPrestamo> RegistroPagoPrestamos { get; set; }

    public DbSet<FeriaProveedor> FeriaProveedores { get; set; }

    public DbSet<RegistroPagoFeria> RegistroPagoFerias { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

        // Configurar exclusiones de propiedades aquí para los atributos que se desea ignorar en el entity framework
        modelBuilder.Entity<Usuario>().Ignore(u => u.UserName);
        modelBuilder.Entity<Usuario>().Ignore(u => u.NormalizedUserName);
        modelBuilder.Entity<Usuario>()
            .HasIndex(u => u.cedula)
            .IsUnique();

        ///

        // Establecer relaciones y otras configuraciones del modelo de aportes aquí
        modelBuilder.Entity<AporteAsociado>()
            .HasOne(a => a.Usuario)
            .WithMany(u => u.AportesAsociados)
            .HasForeignKey(a => a.UsuarioId);

        // Establecer relaciones y otras configuraciones del modelo de Usuarios aquí
        // Validación para que la cédula y empleado sean únicos
        modelBuilder.Entity<Usuario>().HasIndex(u => u.cedula).IsUnique();
        modelBuilder.Entity<Usuario>().HasIndex(u => u.idEmpleado).IsUnique();

        // Establecer relaciones y otras configuraciones del modelo de Ahorro aquí
        // Validación para que la cédula y empleado sean únicos
        modelBuilder.Entity<Ahorro>()
            .HasOne(a => a.Usuario)
            .WithMany(u => u.Ahorros)
            .HasForeignKey(a => a.UsuarioId);
        // Establecer relaciones y otras configuraciones del modelo de RegistroPagoAhorro  aquí
        // Validación para que la cédula y empleado sean únicos
        modelBuilder.Entity<RegistroPagoAhorro>()
            .HasOne(a => a.Ahorro)
            .WithMany(u => u.RegistroPagoAhorros)
            .HasForeignKey(a => a.idAhorro);

        // Establecer relaciones y otras configuraciones del modelo de Prestamo  aquí
        // Validación para que la cédula y empleado sean únicos
        modelBuilder.Entity<Prestamo>()
            .HasOne(a => a.Usuario)
            .WithMany(u => u.Prestamos)
            .HasForeignKey(a => a.UsuarioId);
       
        // Establecer relaciones y otras configuraciones del modelo de RegistroPagosPrestamos  aquí

        modelBuilder.Entity<RegistroPagoPrestamo>()
           .HasOne(a => a.Prestamo)
           .WithMany(u => u.RegistroPagoPrestamo)
           .HasForeignKey(a => a.idPrestamo);

        //

        modelBuilder.Entity<RegistroPagoFeria>(entity =>
        {
            entity.HasOne(r => r.Usuario)
                  .WithMany(u => u.RegistroPagoFerias)
                  .HasForeignKey(r => r.UsuarioCedula)
                  .HasPrincipalKey(u => u.cedula);
        });


        // Llamar al método base
        base.OnModelCreating(modelBuilder);
    }
}
