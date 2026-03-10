using System;
using System.Collections.Generic;
using System.Linq;
using AsehellmannAppApi.Controllers;
using AsehellmannAppApi.Modelos;
using AsehellmannAppApi.Modelos.ModeloDto.AhorrosDtos;
using AsehellmannAppApi.Modelos.ModeloDto.RegistroPagoAhorroDto;
using AsehellmannAppApi.Modelos.ModeloDto.RegistroPagoPrestamoDto;
using AsehellmannAppApi.Repositorio.IRepositorio;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace PruebasUnitariasAsehelmann
{
    public class RegistroAhorrosTest
    {
        private readonly Mock<IRegistroPagoAhorroRepositorio> _mockRegistroRepo;
        private readonly Mock<IAhorroRepositorio> _mockAhorroRepo;
        private readonly Mock<IMapper> _mockMapper;
        private readonly RegistroPagoAhorroController _registroController;

        public RegistroAhorrosTest()
        {
            _mockRegistroRepo = new Mock<IRegistroPagoAhorroRepositorio>();
            _mockAhorroRepo = new Mock<IAhorroRepositorio>();
            _mockMapper = new Mock<IMapper>();
            _registroController = new RegistroPagoAhorroController(_mockRegistroRepo.Object, _mockMapper.Object, _mockAhorroRepo.Object);
        }

        [Fact]
        public void MostrarRegistroPagoAhorros_ReturnsOkWithMostrarRegistroPagoDtoList()
        {
            // Arrange
            var listaRegistroPagoAhorros = new List<RegistroPagoAhorro>
            {
                new RegistroPagoAhorro { Ahorro = new Ahorro(), fechaRegistro = DateTime.Now, montoAhorroRegistrado = 100 },
                new RegistroPagoAhorro { Ahorro = new Ahorro(), fechaRegistro = DateTime.Now, montoAhorroRegistrado = 200 }
            };

            var listaRegistroPagoAhorrosDto = new List<MostrarRegistroPagoAhorroDto>
            {
                new MostrarRegistroPagoAhorroDto { mostrarAhorro = new MostrarAhorroDto(), fechaRegistro = DateTime.Now, montoAhorroRegistrado = 100 },
                new MostrarRegistroPagoAhorroDto { mostrarAhorro = new MostrarAhorroDto(), fechaRegistro = DateTime.Now, montoAhorroRegistrado = 200 }
            };

            _mockRegistroRepo.Setup(repo => repo.getRegistroPagoAhorros()).Returns(listaRegistroPagoAhorros);
            _mockMapper.Setup(mapper => mapper.Map<IEnumerable<MostrarRegistroPagoAhorroDto>>(listaRegistroPagoAhorros)).Returns(listaRegistroPagoAhorrosDto);

            // Act
            var result = _registroController.mostrarRegistroPagoAhorros() as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status200OK, result.StatusCode);

            var returnValue = Assert.IsType<List<MostrarRegistroPagoAhorroDto>>(result.Value);
            Assert.Equal(listaRegistroPagoAhorrosDto.Count, returnValue.Count);
        }

        [Fact]
        public void MostrarRegistroPagoAhorrosPorUsuario_ReturnsOkWithMostrarRegistroPagoDtoList()
        {
            // Arrange
            string cedula = "123456789";
            var listaRegistroPagoAhorros = new List<RegistroPagoAhorro>
            {
                new RegistroPagoAhorro { Ahorro = new Ahorro { Usuario = new Usuario { cedula = cedula } }, fechaRegistro = DateTime.Now, montoAhorroRegistrado = 100 },
                new RegistroPagoAhorro { Ahorro = new Ahorro { Usuario = new Usuario { cedula = cedula } }, fechaRegistro = DateTime.Now, montoAhorroRegistrado = 200 }
            };

            var listaRegistroPagoAhorrosDto = new List<MostrarRegistroPagoAhorroDto>
            {
                new MostrarRegistroPagoAhorroDto { mostrarAhorro = new MostrarAhorroDto(), fechaRegistro = DateTime.Now, montoAhorroRegistrado = 100 },
                new MostrarRegistroPagoAhorroDto { mostrarAhorro = new MostrarAhorroDto(), fechaRegistro = DateTime.Now, montoAhorroRegistrado = 200 }
            };

            _mockRegistroRepo.Setup(repo => repo.getRegistroPagoAhorroUsuarioEspecifico(cedula)).Returns(listaRegistroPagoAhorros);
            _mockMapper.Setup(mapper => mapper.Map<IEnumerable<MostrarRegistroPagoAhorroDto>>(listaRegistroPagoAhorros)).Returns(listaRegistroPagoAhorrosDto);

            // Act
            var result = _registroController.MostrarRegistroPagoAhorrosPorUsuario(cedula) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status200OK, result.StatusCode);

            var returnValue = Assert.IsType<List<MostrarRegistroPagoAhorroDto>>(result.Value);
            Assert.Equal(listaRegistroPagoAhorrosDto.Count, returnValue.Count);
        }
    }
}
