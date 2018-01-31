using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace VipcoMachine.Migrations
{
    public partial class Update_GroupMis : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GroupMIS",
                table: "OverTimeMaster",
                type: "nvarchar(100)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_OverTimeMaster_GroupMIS",
                table: "OverTimeMaster",
                column: "GroupMIS");

            migrationBuilder.AddForeignKey(
                name: "FK_OverTimeMaster_EmployeeGroupMIS_GroupMIS",
                table: "OverTimeMaster",
                column: "GroupMIS",
                principalTable: "EmployeeGroupMIS",
                principalColumn: "GroupMIS",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OverTimeMaster_EmployeeGroupMIS_GroupMIS",
                table: "OverTimeMaster");

            migrationBuilder.DropIndex(
                name: "IX_OverTimeMaster_GroupMIS",
                table: "OverTimeMaster");

            migrationBuilder.DropColumn(
                name: "GroupMIS",
                table: "OverTimeMaster");
        }
    }
}
