using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace VipcoMachine.Migrations
{
    public partial class UpdateModel061017 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Material");

            migrationBuilder.DropColumn(
                name: "Length",
                table: "Material");

            migrationBuilder.DropColumn(
                name: "SquareMeter",
                table: "Material");

            migrationBuilder.DropColumn(
                name: "Thickness",
                table: "Material");

            migrationBuilder.DropColumn(
                name: "Weight",
                table: "Material");

            migrationBuilder.DropColumn(
                name: "Width",
                table: "Material");

            migrationBuilder.AddColumn<string>(
                name: "Grade",
                table: "Material",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Material",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Size",
                table: "Material",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaterialId",
                table: "CuttingPlan",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Quantity",
                table: "CuttingPlan",
                type: "float",
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

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CuttingPlan_Material_MaterialId",
                table: "CuttingPlan");

            migrationBuilder.DropIndex(
                name: "IX_CuttingPlan_MaterialId",
                table: "CuttingPlan");

            migrationBuilder.DropColumn(
                name: "Grade",
                table: "Material");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Material");

            migrationBuilder.DropColumn(
                name: "Size",
                table: "Material");

            migrationBuilder.DropColumn(
                name: "MaterialId",
                table: "CuttingPlan");

            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "CuttingPlan");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Material",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Length",
                table: "Material",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "SquareMeter",
                table: "Material",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Thickness",
                table: "Material",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Weight",
                table: "Material",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Width",
                table: "Material",
                nullable: true);
        }
    }
}
