using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace VipcoMachine.Migrations
{
    public partial class UpdateModel271017 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EmployeeGroup",
                columns: table => new
                {
                    GroupCode = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Remark = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmployeeGroup", x => x.GroupCode);
                });

            migrationBuilder.CreateTable(
                name: "OverTimeMaster",
                columns: table => new
                {
                    OverTimeMasterId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Creator = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EmpApprove = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    EmpRequire = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    GroupCode = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    InfoActual = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    InfoPlan = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    LastOverTimeId = table.Column<int>(type: "int", nullable: true),
                    ModifyDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Modifyer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OverTimeDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    OverTimeStatus = table.Column<int>(type: "int", nullable: false),
                    ProjectCodeMasterId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OverTimeMaster", x => x.OverTimeMasterId);
                    table.ForeignKey(
                        name: "FK_OverTimeMaster_Employee_EmpApprove",
                        column: x => x.EmpApprove,
                        principalTable: "Employee",
                        principalColumn: "EmpCode",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OverTimeMaster_Employee_EmpRequire",
                        column: x => x.EmpRequire,
                        principalTable: "Employee",
                        principalColumn: "EmpCode",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OverTimeMaster_EmployeeGroup_GroupCode",
                        column: x => x.GroupCode,
                        principalTable: "EmployeeGroup",
                        principalColumn: "GroupCode",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OverTimeMaster_OverTimeMaster_LastOverTimeId",
                        column: x => x.LastOverTimeId,
                        principalTable: "OverTimeMaster",
                        principalColumn: "OverTimeMasterId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OverTimeMaster_ProjectCodeMaster_ProjectCodeMasterId",
                        column: x => x.ProjectCodeMasterId,
                        principalTable: "ProjectCodeMaster",
                        principalColumn: "ProjectCodeMasterId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "OverTimeDetail",
                columns: table => new
                {
                    OverTimeDetailId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Creator = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EmpCode = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    ModifyDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Modifyer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OverTimeDetailStatus = table.Column<int>(type: "int", nullable: true),
                    OverTimeMasterId = table.Column<int>(type: "int", nullable: true),
                    Remark = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    TotalHour = table.Column<double>(type: "float", maxLength: 24, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OverTimeDetail", x => x.OverTimeDetailId);
                    table.ForeignKey(
                        name: "FK_OverTimeDetail_Employee_EmpCode",
                        column: x => x.EmpCode,
                        principalTable: "Employee",
                        principalColumn: "EmpCode",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OverTimeDetail_OverTimeMaster_OverTimeMasterId",
                        column: x => x.OverTimeMasterId,
                        principalTable: "OverTimeMaster",
                        principalColumn: "OverTimeMasterId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OverTimeDetail_EmpCode",
                table: "OverTimeDetail",
                column: "EmpCode");

            migrationBuilder.CreateIndex(
                name: "IX_OverTimeDetail_OverTimeMasterId",
                table: "OverTimeDetail",
                column: "OverTimeMasterId");

            migrationBuilder.CreateIndex(
                name: "IX_OverTimeMaster_EmpApprove",
                table: "OverTimeMaster",
                column: "EmpApprove");

            migrationBuilder.CreateIndex(
                name: "IX_OverTimeMaster_EmpRequire",
                table: "OverTimeMaster",
                column: "EmpRequire");

            migrationBuilder.CreateIndex(
                name: "IX_OverTimeMaster_GroupCode",
                table: "OverTimeMaster",
                column: "GroupCode");

            migrationBuilder.CreateIndex(
                name: "IX_OverTimeMaster_LastOverTimeId",
                table: "OverTimeMaster",
                column: "LastOverTimeId");

            migrationBuilder.CreateIndex(
                name: "IX_OverTimeMaster_ProjectCodeMasterId",
                table: "OverTimeMaster",
                column: "ProjectCodeMasterId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OverTimeDetail");

            migrationBuilder.DropTable(
                name: "OverTimeMaster");

            migrationBuilder.DropTable(
                name: "EmployeeGroup");
        }
    }
}
