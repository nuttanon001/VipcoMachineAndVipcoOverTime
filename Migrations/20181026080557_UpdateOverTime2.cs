using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace VipcoMachine.Migrations
{
    public partial class UpdateOverTime2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BomCode",
                table: "OverTimeMaster",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TypeCode",
                table: "OverTimeMaster",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BomCode",
                table: "OverTimeMaster");

            migrationBuilder.DropColumn(
                name: "TypeCode",
                table: "OverTimeMaster");
        }
    }
}
