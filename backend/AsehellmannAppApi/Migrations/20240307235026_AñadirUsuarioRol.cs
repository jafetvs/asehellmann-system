using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AsehellmannAppApi.Migrations
{
    /// <inheritdoc />
    public partial class AñadirUsuarioRol : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "fecha",
                table: "AportesAsociados",
                newName: "fechaDelAporte");

            migrationBuilder.AddColumn<DateTime>(
                name: "fechaCreacionAporte",
                table: "AportesAsociados",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "fechaCreacionAporte",
                table: "AportesAsociados");

            migrationBuilder.RenameColumn(
                name: "fechaDelAporte",
                table: "AportesAsociados",
                newName: "fecha");
        }
    }
}
