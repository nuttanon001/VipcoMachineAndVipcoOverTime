using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace VipcoMachine.Migrations
{
    public partial class Update_NoTaskMachine : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GroupMis",
                table: "NoTaskMachine",
                type: "nvarchar(100)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_NoTaskMachine_GroupMis",
                table: "NoTaskMachine",
                column: "GroupMis");

            migrationBuilder.AddForeignKey(
                name: "FK_NoTaskMachine_EmployeeGroupMIS_GroupMis",
                table: "NoTaskMachine",
                column: "GroupMis",
                principalTable: "EmployeeGroupMIS",
                principalColumn: "GroupMIS",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_NoTaskMachine_EmployeeGroupMIS_GroupMis",
                table: "NoTaskMachine");

            migrationBuilder.DropIndex(
                name: "IX_NoTaskMachine_GroupMis",
                table: "NoTaskMachine");

            migrationBuilder.DropColumn(
                name: "GroupMis",
                table: "NoTaskMachine");
        }
    }
}
