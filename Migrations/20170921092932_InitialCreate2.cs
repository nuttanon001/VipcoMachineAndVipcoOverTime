using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace VipcoMachine.Migrations
{
    public partial class InitialCreate2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TaskMachineHasOverTime",
                columns: table => new
                {
                    OverTimeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Creator = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    ModifyDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Modifyer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OverTimeEnd = table.Column<DateTime>(type: "datetime2", nullable: true),
                    OverTimePerDate = table.Column<double>(type: "float", nullable: true),
                    OverTimeStart = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TaskMachineId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaskMachineHasOverTime", x => x.OverTimeId);
                    table.ForeignKey(
                        name: "FK_TaskMachineHasOverTime_TaskMachine_TaskMachineId",
                        column: x => x.TaskMachineId,
                        principalTable: "TaskMachine",
                        principalColumn: "TaskMachineId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TaskMachineHasOverTime_TaskMachineId",
                table: "TaskMachineHasOverTime",
                column: "TaskMachineId",
                unique: true,
                filter: "[TaskMachineId] IS NOT NULL");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TaskMachineHasOverTime");
        }
    }
}
