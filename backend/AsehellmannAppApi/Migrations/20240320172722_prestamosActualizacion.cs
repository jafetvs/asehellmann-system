using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AsehellmannAppApi.Migrations
{
    /// <inheritdoc />
    public partial class prestamosActualizacion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "saldoFinal",
                table: "Prestamos",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<string>(
                name: "status",
                table: "Prestamos",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<float>(
                name: "totalMontoPagar",
                table: "Prestamos",
                type: "real",
                nullable: false,
                defaultValue: 0f);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "saldoFinal",
                table: "Prestamos");

            migrationBuilder.DropColumn(
                name: "status",
                table: "Prestamos");

            migrationBuilder.DropColumn(
                name: "totalMontoPagar",
                table: "Prestamos");
        }
    }
}
