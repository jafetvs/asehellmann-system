using System;
using System.Collections.Generic;
using AsehellmannAppApi.Controllers;
using AsehellmannAppApi.Modelos.ModeloDto.PrestamoDtos;
using AsehellmannAppApi.Modelos;
using AsehellmannAppApi.Repositorio.IRepositorio;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace PruebasUnitariasAsehelmann
{
    public class PrestamosTest : IDisposable
    {
        private readonly Mock<IPrestamoRepositorio> _mockPrestamoRepo;
        private readonly Mock<IMapper> _mockMapper;
        private readonly PrestamoController _prestamoController;

        public PrestamosTest()
        {
            _mockPrestamoRepo = new Mock<IPrestamoRepositorio>();
            _mockMapper = new Mock<IMapper>();
            _prestamoController = new PrestamoController(_mockPrestamoRepo.Object, _mockMapper.Object);
        }

        [Fact]
        public void CrearPrestamo_AportesInsuficientes_ReturnsBadRequest()
        {
            // Arrange
            var crearPrestamoDto = new CrearPrestamoDto { cedula = "123456789", montoPrestamo = 10000 };

            _mockPrestamoRepo.Setup(repo => repo.crearPrestamo(It.IsAny<CrearPrestamoDto>())).Returns((Prestamo)null);

            // Act
            var result = _prestamoController.CrearPrestamo(crearPrestamoDto);

            // Assert
            var actionResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("No tiene aportes suficientes para optar por este préstamo o el usuario no existe.", actionResult.Value);
        }

        [Fact]
        public void CrearPrestamo_AportesSuficientes_ReturnsOk()
        {
            // Arrange
            var crearPrestamoDto = new CrearPrestamoDto { cedula = "123456789", montoPrestamo = 10000 };
            var prestamo = new Prestamo { /* Datos del préstamo */ };

            _mockPrestamoRepo.Setup(repo => repo.crearPrestamo(It.IsAny<CrearPrestamoDto>())).Returns(prestamo);

            // Act
            var result = _prestamoController.CrearPrestamo(crearPrestamoDto);

            // Assert
            var actionResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("Préstamo creado exitosamente.", actionResult.Value);
        }

        [Fact]
        public void ObtenerPrestamos_ReturnsOkWithPrestamoDtoList()
        {
            // Arrange
            var prestamos = new List<Prestamo> { /* Datos de préstamos simulados */ };
            var prestamoDtos = new List<PrestamoDto> { /* Datos de DTOs simulados */ };

            _mockPrestamoRepo.Setup(repo => repo.getAllPrestamos()).Returns(prestamos);
            _mockMapper.Setup(mapper => mapper.Map<IEnumerable<PrestamoDto>>(It.IsAny<IEnumerable<Prestamo>>())).Returns(prestamoDtos);

            // Act
            var result = _prestamoController.getAportesOrderByCedula() as OkObjectResult;
            var returnValue = result.Value as IEnumerable<PrestamoDto>;

            // Assert
            Assert.NotNull(returnValue);
            Assert.Equal(prestamoDtos.Count, returnValue.Count());

            // Comparar cada elemento de las colecciones prestamoDtos y returnValue
            for (int i = 0; i < prestamoDtos.Count; i++)
            {
                var expected = prestamoDtos[i];
                var actual = returnValue.ElementAt(i);

                // Aquí compararías cada campo o propiedad de los objetos expected y actual
                Assert.Equal(expected.idPrestamo, actual.idPrestamo);
                Assert.Equal(expected.tipoPrestamo, actual.tipoPrestamo);
                // Añade más aserciones según sea necesario para otros campos o propiedades
            }
        }




        public void Dispose()
        {
            // Aquí puedes realizar limpieza si es necesaria
        }
    }
}
