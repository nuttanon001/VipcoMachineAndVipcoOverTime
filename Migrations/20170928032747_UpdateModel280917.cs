using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace VipcoMachine.Migrations
{
    public partial class UpdateModel280917 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "StandardTimeId",
                table: "JobCardDetail",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_JobCardDetail_StandardTimeId",
                table: "JobCardDetail",
                column: "StandardTimeId");

            migrationBuilder.AddForeignKey(
                name: "FK_JobCardDetail_StandardTime_StandardTimeId",
                table: "JobCardDetail",
                column: "StandardTimeId",
                principalTable: "StandardTime",
                principalColumn: "StandardTimeId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_JobCardDetail_StandardTime_StandardTimeId",
                table: "JobCardDetail");

            migrationBuilder.DropIndex(
                name: "IX_JobCardDetail_StandardTimeId",
                table: "JobCardDetail");

            migrationBuilder.DropColumn(
                name: "StandardTimeId",
                table: "JobCardDetail");
        }
    }
}
