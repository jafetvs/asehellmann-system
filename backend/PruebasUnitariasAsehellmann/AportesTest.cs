using System.Collections.Generic;
using AsehellmannAppApi.Controllers;
using AsehellmannAppApi.Modelos.ModeloDto;
using AsehellmannAppApi.Modelos.ModeloDto.AporteAsociadoDtos;
using AsehellmannAppApi.Repositorio.IRepositorio;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace AsehellmannAppApi.Tests.Controllers
{
    public class AporteTests
    {
        [Fact]
        public void GetAportesOrderByCedula_DebeRetornarAportesOrdenadosPorCedula()
        {
            // Arrange
            var mockMapper = new Mock<IMapper>();
            var mockRepo = new Mock<IAporteAsociadoRepositorio>();

            var mockAportes = new List<AporteAsociado>
            {
                new AporteAsociado
                {
                    Usuario = new Usuario { cedula = "5555", nombre = "Administrador", apellidos = "." },
                    aportePatronal = 20000,
                    aportePersonal = 20000,
                    aportePersonalesAcumulado = 19000,
                    aportePatronalesAcumulado = 20000,
                   
                },
                // Agrega otros aportes aqui
            };

            mockRepo.Setup(m => m.getAportesOrderByCedula()).Returns(mockAportes);

            var controller = new AporteAsociadoController(mockRepo.Object, mockMapper.Object);

            // Act
            var response = controller.getAportesOrderByCedula() as OkObjectResult;
            var result = response.Value as List<AporteAsociadoDto>;

            // Assert
            Assert.NotNull(response);
            Assert.NotNull(result);
            Assert.IsType<List<AporteAsociadoDto>>(result);
            Assert.Equal(StatusCodes.Status200OK, response.StatusCode);

            // Verificar el orden por cedula
            for (int i = 1; i < result.Count; i++)
            {
                Assert.True(string.Compare(result[i - 1].Usuario.cedula, result[i].Usuario.cedula) >= 0);
            }
        }

        [Fact]
        public void GetAportesOrderByCedula_DevuelveListaVacia_CuandoNoExistenAportes()
        {
            // Arrange
            var mockMapper = new Mock<IMapper>();
            var mockRepo = new Mock<IAporteAsociadoRepositorio>();

            mockRepo.Setup(m => m.getAportesOrderByCedula()).Returns(new List<AporteAsociado>());
            var controller = new AporteAsociadoController(mockRepo.Object, mockMapper.Object);

            // Act
            var result = controller.getAportesOrderByCedula();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var listaDto = Assert.IsType<List<AporteAsociadoDto>>(okResult.Value);

            // Assert that an empty list is returned
            Assert.Empty(listaDto);
        }
    }
}
