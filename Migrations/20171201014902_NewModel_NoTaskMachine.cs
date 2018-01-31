using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace VipcoMachine.Migrations
{
    public partial class NewModel_NoTaskMachine : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "NoTaskMachine",
                columns: table => new
                {
                    NoTaskMachineId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    AssignedBy = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Creator = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    GroupCode = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    JobCardDetailId = table.Column<int>(type: "int", nullable: false),
                    ModifyDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Modifyer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NoTaskMachineCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Quantity = table.Column<double>(type: "float", nullable: true),
                    Remark = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NoTaskMachine", x => x.NoTaskMachineId);
                    table.ForeignKey(
                        name: "FK_NoTaskMachine_Employee_AssignedBy",
                        column: x => x.AssignedBy,
                        principalTable: "Employee",
                        principalColumn: "EmpCode",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_NoTaskMachine_EmployeeGroup_GroupCode",
                        column: x => x.GroupCode,
                        principalTable: "EmployeeGroup",
                        principalColumn: "GroupCode",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_NoTaskMachine_JobCardDetail_JobCardDetailId",
                        column: x => x.JobCardDetailId,
                        principalTable: "JobCardDetail",
                        principalColumn: "JobCardDetailId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_NoTaskMachine_AssignedBy",
                table: "NoTaskMachine",
                column: "AssignedBy");

            migrationBuilder.CreateIndex(
                name: "IX_NoTaskMachine_GroupCode",
                table: "NoTaskMachine",
                column: "GroupCode");

            migrationBuilder.CreateIndex(
                name: "IX_NoTaskMachine_JobCardDetailId",
                table: "NoTaskMachine",
                column: "JobCardDetailId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NoTaskMachine");
        }
    }
}
