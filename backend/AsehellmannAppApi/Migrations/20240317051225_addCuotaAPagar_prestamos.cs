using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AsehellmannAppApi.Migrations
{
    /// <inheritdoc />
    public partial class addCuotaAPagar_prestamos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "cuotaAPagar",
                table: "Prestamos",
                type: "real",
                nullable: false,
                defaultValue: 0f);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "cuotaAPagar",
                table: "Prestamos");
        }
    }
}
