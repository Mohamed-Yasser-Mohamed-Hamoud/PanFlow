using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PanFlow.API.Migrations
{
    /// <inheritdoc />
    public partial class endGame : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Days",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Days_UserId",
                table: "Days",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Days_AspNetUsers_UserId",
                table: "Days",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Days_AspNetUsers_UserId",
                table: "Days");

            migrationBuilder.DropIndex(
                name: "IX_Days_UserId",
                table: "Days");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Days");
        }
    }
}
