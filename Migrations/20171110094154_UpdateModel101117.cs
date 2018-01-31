using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace VipcoMachine.Migrations
{
    public partial class UpdateModel101117 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GroupMIS",
                table: "Employee",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "EmployeeGroupMIS",
                columns: table => new
                {
                    GroupMIS = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    GroupDesc = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    Remark = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmployeeGroupMIS", x => x.GroupMIS);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Employee_GroupMIS",
                table: "Employee",
                column: "GroupMIS");

            migrationBuilder.AddForeignKey(
                name: "FK_Employee_EmployeeGroupMIS_GroupMIS",
                table: "Employee",
                column: "GroupMIS",
                principalTable: "EmployeeGroupMIS",
                principalColumn: "GroupMIS",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Employee_EmployeeGroupMIS_GroupMIS",
                table: "Employee");

            migrationBuilder.DropTable(
                name: "EmployeeGroupMIS");

            migrationBuilder.DropIndex(
                name: "IX_Employee_GroupMIS",
                table: "Employee");

            migrationBuilder.DropColumn(
                name: "GroupMIS",
                table: "Employee");
        }
    }
}
