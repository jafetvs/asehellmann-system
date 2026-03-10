using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AsehellmannAppApi.Migrations
{
    /// <inheritdoc />
    public partial class TablaRegistroPagoPrestamo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RegistroPagoPrestamos",
                columns: table => new
                {
                    idRegistroPagoPrestamo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    fechaRegistro = table.Column<DateTime>(type: "datetime2", nullable: false),
                    montoPrestamoRegistrado = table.Column<float>(type: "real", nullable: false),
                    montoPagoExtraOrdinario = table.Column<float>(type: "real", nullable: false),
                    idPrestamo = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RegistroPagoPrestamos", x => x.idRegistroPagoPrestamo);
                    table.ForeignKey(
                        name: "FK_RegistroPagoPrestamos_Prestamos_idPrestamo",
                        column: x => x.idPrestamo,
                        principalTable: "Prestamos",
                        principalColumn: "idPrestamo",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RegistroPagoPrestamos_idPrestamo",
                table: "RegistroPagoPrestamos",
                column: "idPrestamo");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RegistroPagoPrestamos");
        }
    }
}
