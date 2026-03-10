using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AsehellmannAppApi.Migrations
{
    /// <inheritdoc />
    public partial class TablaFeriaProveedor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FeriaProveedors",
                columns: table => new
                {
                    idFeriaProveedor = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nombreProveedor = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ventaTotales = table.Column<float>(type: "real", nullable: false),
                    fechaFeria = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FeriaProveedors", x => x.idFeriaProveedor);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FeriaProveedors");
        }
    }
}
