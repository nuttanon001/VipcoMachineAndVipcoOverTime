using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace VipcoMachine.Migrations
{
    public partial class UpdateModel061017_2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CuttingPlan_Material_MaterialId",
                table: "CuttingPlan");

            migrationBuilder.DropIndex(
                name: "IX_CuttingPlan_MaterialId",
                table: "CuttingPlan");

            migrationBuilder.DropColumn(
                name: "MaterialId",
                table: "CuttingPlan");

            migrationBuilder.AddColumn<string>(
                name: "MaterialGrade",
                table: "CuttingPlan",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MaterialSize",
                table: "CuttingPlan",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaterialGrade",
                table: "CuttingPlan");

            migrationBuilder.DropColumn(
                name: "MaterialSize",
                table: "CuttingPlan");

            migrationBuilder.AddColumn<int>(
                name: "MaterialId",
                table: "CuttingPlan",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_CuttingPlan_MaterialId",
                table: "CuttingPlan",
                column: "MaterialId");

            migrationBuilder.AddForeignKey(
                name: "FK_CuttingPlan_Material_MaterialId",
                table: "CuttingPlan",
                column: "MaterialId",
                principalTable: "Material",
                principalColumn: "MaterialId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
