using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AsehellmannAppApi.Migrations
{
    /// <inheritdoc />
    public partial class RegistroPagoFeria : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_cedula",
                table: "AspNetUsers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FeriaProveedors",
                table: "FeriaProveedors");

            migrationBuilder.RenameTable(
                name: "FeriaProveedors",
                newName: "FeriaProveedores");

            migrationBuilder.AlterColumn<string>(
                name: "cedula",
                table: "AspNetUsers",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddUniqueConstraint(
                name: "AK_AspNetUsers_cedula",
                table: "AspNetUsers",
                column: "cedula");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FeriaProveedores",
                table: "FeriaProveedores",
                column: "idFeriaProveedor");

            migrationBuilder.CreateTable(
                name: "RegistroPagoFerias",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FeriaProveedorId = table.Column<int>(type: "int", nullable: false),
                    montoCompra = table.Column<float>(type: "real", nullable: false),
                    pagoRealizado = table.Column<float>(type: "real", nullable: false),
                    montoPagarMes = table.Column<float>(type: "real", nullable: false),
                    plazo = table.Column<int>(type: "int", nullable: false),
                    plazoRealizado = table.Column<int>(type: "int", nullable: false),
                    UsuarioCedula = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FechaCompra = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RegistroPagoFerias", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RegistroPagoFerias_AspNetUsers_UsuarioCedula",
                        column: x => x.UsuarioCedula,
                        principalTable: "AspNetUsers",
                        principalColumn: "cedula",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RegistroPagoFerias_FeriaProveedores_FeriaProveedorId",
                        column: x => x.FeriaProveedorId,
                        principalTable: "FeriaProveedores",
                        principalColumn: "idFeriaProveedor",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_cedula",
                table: "AspNetUsers",
                column: "cedula",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RegistroPagoFerias_FeriaProveedorId",
                table: "RegistroPagoFerias",
                column: "FeriaProveedorId");

            migrationBuilder.CreateIndex(
                name: "IX_RegistroPagoFerias_UsuarioCedula",
                table: "RegistroPagoFerias",
                column: "UsuarioCedula");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RegistroPagoFerias");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_AspNetUsers_cedula",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_cedula",
                table: "AspNetUsers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FeriaProveedores",
                table: "FeriaProveedores");

            migrationBuilder.RenameTable(
                name: "FeriaProveedores",
                newName: "FeriaProveedors");

            migrationBuilder.AlterColumn<string>(
                name: "cedula",
                table: "AspNetUsers",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FeriaProveedors",
                table: "FeriaProveedors",
                column: "idFeriaProveedor");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_cedula",
                table: "AspNetUsers",
                column: "cedula",
                unique: true,
                filter: "[cedula] IS NOT NULL");
        }
    }
}
