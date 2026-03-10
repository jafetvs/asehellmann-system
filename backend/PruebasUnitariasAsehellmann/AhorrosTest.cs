using Microsoft.EntityFrameworkCore;
using AsehellmannAppApi.Controllers;
using AsehellmannAppApi.Repositorio;
using AsehellmannAppApi.Modelos.ModeloDto.AhorrosDtos;
using Microsoft.AspNetCore.Mvc;

using AsehellmannAppApi.Repositorio.IRepositorio;
using Moq;
using Microsoft.Extensions.DependencyInjection;
using AsehellmannAppApi.Modelos;
using AutoMapper;
using AsehellmannAppApi.Modelos.ModeloDto;

namespace PruebasUnitariasAsehelmann
{
    /// <summary>
    /// Pruebas funcionales
    /// </summary>
    public class AhorrosTesting : IDisposable
    {
        private readonly ApplicationDbContext _context;
        private readonly AhorroController _ahorroController;
        private readonly AhorroRepositorio _ahorroRepositorio;
        private readonly Mock<IUsuarioRepositorio> _mockUsRepo;
        private readonly Mock<IAhorroRepositorio> _mockAhorroRepo;

        public AhorrosTesting()
        {
            var serviceProvider = new ServiceCollection()
                .AddEntityFrameworkInMemoryDatabase()
                .BuildServiceProvider();

            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .UseInternalServiceProvider(serviceProvider)
                .Options;

            _context = new ApplicationDbContext(options);

            // Agregar usuarios de prueba a la base de datos en memoria
            _context.Usuarios.Add(new Usuario { cedula = "304990435", nombre = "Usuario", apellidos = "Prueba" });
            // Agrega más usuarios de prueba si es necesario
            _context.SaveChanges();

            _ahorroRepositorio = new AhorroRepositorio(_context);
            _mockUsRepo = new Mock<IUsuarioRepositorio>();
            _mockAhorroRepo = new Mock<IAhorroRepositorio>();
            _ahorroController = new AhorroController(_ahorroRepositorio, null, _mockUsRepo.Object);
        }

        [Fact]
        public void CrearAhorroUsuarioEspecifico_UsuarioNoExiste_ReturnsNotFound()
        {
            // Arrange
            var crearAhorroDto = new CrearAhorroDto { cedula = "No_existe", tipoAhorro = "navidad", montoDebitar = 1000, fechaInicio = DateTime.Now };

            // Configurar el mock para que devuelva false
            _mockUsRepo.Setup(repo => repo.existeUsuario(It.IsAny<string>())).Returns(false);

            // Act
            var result = _ahorroController.crearAhorroUsuarioEspecifico(crearAhorroDto);

            // Assert
            var actionResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("El usuario no existe", actionResult.Value);
        }

        [Fact]
        public void CrearAhorroUsuarioEspecifico_AhorroRealizadoSuccessfully()
        {
            // Arrange
            string cedulaExistente = "304990435"; // Cédula de usuario existente en la base de datos de prueba
            var crearAhorroDto = new CrearAhorroDto { cedula = cedulaExistente, tipoAhorro = "navidad", montoDebitar = 1000, fechaInicio = DateTime.Now };

            // Configurar el mock para que devuelva true
            _mockUsRepo.Setup(repo => repo.existeUsuario(cedulaExistente)).Returns(true);

            // Act
            var result = _ahorroController.crearAhorroUsuarioEspecifico(crearAhorroDto);

            // Assert
            Assert.Equal(_context, _ahorroRepositorio.Context);
            var actionResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<CrearAhorroDto>(actionResult.Value);
            Assert.Equal(crearAhorroDto.cedula, returnValue.cedula);
            Assert.Equal(crearAhorroDto.tipoAhorro, returnValue.tipoAhorro);
            Assert.Equal(crearAhorroDto.montoDebitar, returnValue.montoDebitar);
            // Agrega más aserciones según sea necesario para verificar que se ha creado el ahorro correctamente.
        }
        [Fact]
        public void GetAhorrosOrderByCedula_ReturnsOkWithAhorrosDtoList()
        {
            // Arrange
            var mockAhorroRepo = new Mock<IAhorroRepositorio>();
            var mockMapper = new Mock<IMapper>();

            // Datos simulados
            var ahorros = new List<Ahorro>
            {
                new Ahorro { idAhorro = 1, tipoAhorro = "navidad", montoDebitar = 500, UsuarioId = "1", status = "Activo" },
                new Ahorro { idAhorro = 2, tipoAhorro = "cuestaEnero", montoDebitar = 1000, UsuarioId = "2", status = "Activo" }
            };

            var ahorrosDto = new List<MostrarAhorroDto>
            {
                new MostrarAhorroDto { id = 1, tipoAhorro = "navidad", montoDebitar = 500, UsuarioId = "1", status = "Activo" },
                new MostrarAhorroDto { id = 2, tipoAhorro = "cuestaEnero", montoDebitar = 1000, UsuarioId = "2", status = "Activo" }
            };

            mockAhorroRepo.Setup(repo => repo.getAhorros()).Returns(ahorros);
            mockMapper.Setup(mapper => mapper.Map<IEnumerable<MostrarAhorroDto>>(ahorros)).Returns(ahorrosDto);

            var controller = new AhorroController(mockAhorroRepo.Object, mockMapper.Object, null);

            // Act
            var result = controller.getAhorrosOrderByCedula();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsAssignableFrom<IEnumerable<MostrarAhorroDto>>(okResult.Value);

            Assert.Equal(ahorrosDto.Count, returnValue.Count());
            // Aquí puedes agregar más aserciones según tus necesidades específicas
        }
        [Fact]
        public void GetAhorrosUsuarioEspecifico_ReturnsOkWithAhorrosDtoList()
        {
            // Arrange
            var mockAhorroRepo = new Mock<IAhorroRepositorio>();
            var mockMapper = new Mock<IMapper>();

            // Datos simulados de ahorros de usuario específico
            string cedula = "304990435";
            var ahorrosUsuario = new List<Ahorro>
            {
                new Ahorro { idAhorro = 1, tipoAhorro = "Navidad", montoDebitar = 500, UsuarioId = cedula, status = "Activo" },
                new Ahorro { idAhorro = 2, tipoAhorro = "Vacaciones", montoDebitar = 1000, UsuarioId = cedula, status = "Activo" }
            };

            // Datos simulados de MostrarAhorroDto esperados
            var ahorrosDto = new List<MostrarAhorroDto>
            {
                new MostrarAhorroDto { id = 1, tipoAhorro = "Navidad", montoDebitar = 500, UsuarioId = cedula, status = "Activo" },
                new MostrarAhorroDto { id = 2, tipoAhorro = "Vacaciones", montoDebitar = 1000, UsuarioId = cedula, status = "Activo" }
            };

            mockAhorroRepo.Setup(repo => repo.getAhorroUsuarioEspecifico(cedula)).Returns(ahorrosUsuario);
            mockMapper.Setup(mapper => mapper.Map<List<MostrarAhorroDto>>(ahorrosUsuario)).Returns(ahorrosDto);

            var controller = new AhorroController(mockAhorroRepo.Object, mockMapper.Object, null);

            // Act
            var result = controller.getAhorrosUsuarioEspecifico(cedula);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsAssignableFrom<IEnumerable<MostrarAhorroDto>>(okResult.Value);

            Assert.Equal(ahorrosDto.Count, returnValue.Count());
            // Agregar más aserciones según sea necesario
        }
        public void Dispose()
        {
            _context.Database.EnsureDeleted(); // Asegura que la base de datos en memoria se elimine después de las pruebas
            _context.Dispose();
        }
    }
}
