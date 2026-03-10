using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AsehellmannAppApi.Migrations
{
    /// <inheritdoc />
    public partial class CreacionTabla_RegistroPagoAhorros : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Ahorros",
                newName: "idAhorro");

            migrationBuilder.CreateTable(
                name: "RegistroPagoAhorros",
                columns: table => new
                {
                    idRegistroPagoAhorro = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    fechaRegistro = table.Column<DateTime>(type: "datetime2", nullable: false),
                    montoAhorroRegistrado = table.Column<int>(type: "int", nullable: false),
                    idAhorro = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RegistroPagoAhorros", x => x.idRegistroPagoAhorro);
                    table.ForeignKey(
                        name: "FK_RegistroPagoAhorros_Ahorros_idAhorro",
                        column: x => x.idAhorro,
                        principalTable: "Ahorros",
                        principalColumn: "idAhorro",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RegistroPagoAhorros_idAhorro",
                table: "RegistroPagoAhorros",
                column: "idAhorro");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RegistroPagoAhorros");

            migrationBuilder.RenameColumn(
                name: "idAhorro",
                table: "Ahorros",
                newName: "Id");
        }
    }
}
