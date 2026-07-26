using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PanFlow.API.Migrations
{
    /// <inheritdoc />
    public partial class eee : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "Days",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Days",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "DayHabits",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Days");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Days");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "DayHabits");
        }
    }
}
