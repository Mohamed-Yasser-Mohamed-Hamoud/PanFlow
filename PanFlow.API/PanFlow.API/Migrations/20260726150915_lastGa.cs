using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PanFlow.API.Migrations
{
    /// <inheritdoc />
    public partial class lastGa : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserId1",
                table: "Days",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Days_UserId1",
                table: "Days",
                column: "UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Days_AspNetUsers_UserId1",
                table: "Days",
                column: "UserId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Days_AspNetUsers_UserId1",
                table: "Days");

            migrationBuilder.DropIndex(
                name: "IX_Days_UserId1",
                table: "Days");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "Days");
        }
    }
}
