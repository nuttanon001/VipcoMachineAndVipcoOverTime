using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace VipcoMachine.Migrations
{
    public partial class AddWorkShop : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "WorkShop",
                columns: table => new
                {
                    WorkShopId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Creator = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ModifyDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Modifyer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Remark = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    WorkShopName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkShop", x => x.WorkShopId);
                });

            migrationBuilder.CreateTable(
                name: "WorkGroupHasWorkShop",
                columns: table => new
                {
                    WorkGroupHasWorkShopId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Creator = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GroupMIS = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    ModifyDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Modifyer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TeamName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    WorkShopId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkGroupHasWorkShop", x => x.WorkGroupHasWorkShopId);
                    table.ForeignKey(
                        name: "FK_WorkGroupHasWorkShop_EmployeeGroupMIS_GroupMIS",
                        column: x => x.GroupMIS,
                        principalTable: "EmployeeGroupMIS",
                        principalColumn: "GroupMIS",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_WorkGroupHasWorkShop_WorkShop_WorkShopId",
                        column: x => x.WorkShopId,
                        principalTable: "WorkShop",
                        principalColumn: "WorkShopId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_WorkGroupHasWorkShop_GroupMIS",
                table: "WorkGroupHasWorkShop",
                column: "GroupMIS");

            migrationBuilder.CreateIndex(
                name: "IX_WorkGroupHasWorkShop_WorkShopId",
                table: "WorkGroupHasWorkShop",
                column: "WorkShopId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WorkGroupHasWorkShop");

            migrationBuilder.DropTable(
                name: "WorkShop");
        }
    }
}
