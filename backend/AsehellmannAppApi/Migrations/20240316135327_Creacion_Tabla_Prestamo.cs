using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AsehellmannAppApi.Migrations
{
    /// <inheritdoc />
    public partial class Creacion_Tabla_Prestamo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Prestamos",
                columns: table => new
                {
                    idPrestamo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tipoPrestamo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    montoPrestamo = table.Column<int>(type: "int", nullable: false),
                    intereses = table.Column<int>(type: "int", nullable: false),
                    fechaSolicitud = table.Column<DateTime>(type: "datetime2", nullable: false),
                    plazoPrestamo = table.Column<int>(type: "int", nullable: false),
                    plazoRealizado = table.Column<int>(type: "int", nullable: false),
                    saldoPrestamo = table.Column<int>(type: "int", nullable: false),
                    UsuarioId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Prestamos", x => x.idPrestamo);
                    table.ForeignKey(
                        name: "FK_Prestamos_AspNetUsers_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Prestamos_UsuarioId",
                table: "Prestamos",
                column: "UsuarioId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Prestamos");
        }
    }
}
