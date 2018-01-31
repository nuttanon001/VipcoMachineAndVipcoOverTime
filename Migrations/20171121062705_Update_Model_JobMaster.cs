using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace VipcoMachine.Migrations
{
    public partial class Update_Model_JobMaster : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GroupCode",
                table: "JobCardMaster",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_JobCardMaster_GroupCode",
                table: "JobCardMaster",
                column: "GroupCode");

            migrationBuilder.AddForeignKey(
                name: "FK_JobCardMaster_EmployeeGroup_GroupCode",
                table: "JobCardMaster",
                column: "GroupCode",
                principalTable: "EmployeeGroup",
                principalColumn: "GroupCode",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_JobCardMaster_EmployeeGroup_GroupCode",
                table: "JobCardMaster");

            migrationBuilder.DropIndex(
                name: "IX_JobCardMaster_GroupCode",
                table: "JobCardMaster");

            migrationBuilder.DropColumn(
                name: "GroupCode",
                table: "JobCardMaster");
        }
    }
}
