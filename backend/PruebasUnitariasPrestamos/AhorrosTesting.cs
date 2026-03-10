using AsehellmannAppApi.Controllers;
using AsehellmannAppApi.Modelos.ModeloDto.AhorrosDtos;
using AsehellmannAppApi.Repositorio.IRepositorio;
using Microsoft.AspNetCore.Mvc;
using Moq;
namespace PruebasUnitariasAsehelmann
{
    public class AhorrosTesting
    {
        private readonly IAhorroRepositorio ahorroRepo;
        private readonly AhorroController ahorroController;

        public AhorrosTesting()
        {
            ahorroRepo = new IAhorroRepositorio();
        }

    }
}