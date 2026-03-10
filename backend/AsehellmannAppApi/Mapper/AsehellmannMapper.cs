
using AsehellmannAppApi.Modelos.ModeloDto.ConvenioDtos;
using AsehellmannAppApi.Modelos.ModeloDto.UsuarioDtos;
using AsehellmannAppApi.Modelos.ModeloDto.AporteAsociadoDtos;
using AutoMapper;
using AsehellmannAppApi.Modelos.ModeloDto;
using AsehellmannAppApi.Modelos;
using AsehellmannAppApi.Modelos.ModeloDto.AhorrosDtos;
using AsehellmannAppApi.Modelos.ModeloDto.RegistroPagoAhorroDto;
using AsehellmannAppApi.Modelos.ModeloDto.PrestamoDtos;
using AsehellmannAppApi.Modelos.ModeloDto.RegistroPagoPrestamoDto;
using AsehellmannAppApi.Modelos.ModeloDto.FeriaProveedor;
using AsehellmannAppApi.Migrations;
using AsehellmannAppApi.Modelos.ModeloDto.RegistroPagoFeria;

namespace AsehellmannAppApi.Mapper
{

    public class AsehellmannMapper : Profile
    {
        public AsehellmannMapper()
        {

            //Maps de usuario
            CreateMap<Usuario, CrearUsuarioDto>().ReverseMap();
            CreateMap<Usuario, MostrarTodoUsuarioDto>().ReverseMap();
            CreateMap<Usuario, UsuarioActualizarDto>().ReverseMap();
            CreateMap<Usuario, UsuarioDatosDto>().ReverseMap();
            CreateMap<Usuario, UsuarioDto>().ReverseMap();
            CreateMap<Usuario, UsuarioLoginDto>().ReverseMap();
            CreateMap<Usuario, UsuarioLoginRespuestaDto>().ReverseMap();
            CreateMap<Usuario, UsuarioRegistroDto>().ReverseMap();


            //Maps de aporte
            CreateMap<AporteAsociado, AporteAsociadoDto>()
               .ForMember(dest => dest.mes, opt => opt.MapFrom(src => src.fechaDelAporte.Month))
                .ForMember(dest => dest.anio, opt => opt.MapFrom(src => src.fechaDelAporte.Year))
                .ReverseMap(); // Opcional si necesita mapeo inverso
            CreateMap<AporteAsociado, CrearAporteAsociadoDto>()
                .ForMember(dest => dest.mes, opt => opt.MapFrom(src => src.fechaDelAporte.Month))
                .ForMember(dest => dest.anio, opt => opt.MapFrom(src => src.fechaDelAporte.Year))
                .ReverseMap();
            CreateMap<AporteAsociado, BuscarAporteAsociadoDto>()
                .ForMember(dest => dest.mes, opt => opt.MapFrom(src => src.fechaDelAporte.Month))
                .ForMember(dest => dest.anio, opt => opt.MapFrom(src => src.fechaDelAporte.Year))
                .ReverseMap();

            //Maps de ahorro
            CreateMap<Ahorro, AhorroDto>().ReverseMap();
            CreateMap<Ahorro, CrearAhorroDto>().ReverseMap();
            CreateMap<Ahorro, MostrarAhorroDto>()
                .ForMember(dest => dest.fechaInicioFormateada, opt => opt.MapFrom(src => src.fechaInicio.ToString("dd/MM/yyyy")))
                .ForMember(dest => dest.fechaFinFormateada, opt => opt.MapFrom(src => src.fechaFin.ToString("dd/MM/yyyy")))
                .ForMember(dest => dest.id, opt => opt.MapFrom(src => src.idAhorro))
                .ForMember(dest => dest.Usuario, opt => opt.MapFrom(src => src.Usuario)); // Mapea la propiedad Usuario


            //Maps convenio
            CreateMap<Convenio, ConvenioDto>().ReverseMap();
            CreateMap<Convenio, CrearConvenioDto>().ReverseMap();

            //Maps registro ahorros
            CreateMap<RegistroPagoAhorro, MostrarRegistroPagoAhorroDto>()
            .ForMember(dest => dest.mostrarAhorro, opt => opt.MapFrom(src => src.Ahorro));
            //.ForMember(dest => dest.idAhorro, opt => opt.MapFrom(src => src.Ahorro.idAhorro));
            //.ForMember(dest => dest.usuario, opt => opt.MapFrom(src => src.Ahorro.Usuario));


            //Maps Prestamos
            CreateMap<Prestamo, PrestamoDto>()
                .ForMember(dest => dest.Usuario, opt => opt.MapFrom(src => src.Usuario))
                .ReverseMap();
            CreateMap<Prestamo, CrearPrestamoDto>().ReverseMap();
            CreateMap<Prestamo, ActualizarCuotaAPagarPrestamoDto>().ReverseMap();
            CreateMap<Prestamo, ActualizarStatusPrestamoDto>().ReverseMap();
            CreateMap<Prestamo, MostrarPrestamoDto>().ReverseMap();


            //Maps registro pretamo
            CreateMap<RegistroPagoPrestamo, MostrarRegistroPagoPrestamoDto>()
            .ForMember(dest => dest.mostrarPrestamo, opt => opt.MapFrom(src => src.Prestamo));
            //.ForMember(dest => dest.idAhorro, opt => opt.MapFrom(src => src.Ahorro.idAhorro));
            //.ForMember(dest => dest.usuario, opt => opt.MapFrom(src => src.Ahorro.Usuario));


            //Maps para FeriaProveedor
            CreateMap<FeriaProveedor, FeriaProveedorDto>().ReverseMap();
            CreateMap<FeriaProveedor, CrearFeriaProveedorDto>().ReverseMap();

            //Maps para registroFeriaDto
            CreateMap<AsehellmannAppApi.Modelos.RegistroPagoFeria, CrearRegistroPagoFeriaDto>().ReverseMap();
            CreateMap<AsehellmannAppApi.Modelos.RegistroPagoFeria, ActualizarRegistroPagoFeriaDto>().ReverseMap();
            CreateMap<AsehellmannAppApi.Modelos.RegistroPagoFeria, CrearRegistroPagoFeriaDto>().ReverseMap();
            CreateMap<AsehellmannAppApi.Modelos.RegistroPagoFeria, ActualizarRegistroPagoFeriaDto>().ReverseMap();
            CreateMap<AsehellmannAppApi.Modelos.RegistroPagoFeria, RegistroPagoFeriaDto>()
                .ForMember(dest => dest.Usuario, opt => opt.MapFrom(src => src.Usuario))
                .ForMember(dest => dest.FeriaProveedor, opt => opt.MapFrom(src => src.FeriaProveedor))
                .ReverseMap();

        }
    }

}
