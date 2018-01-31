using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace VipcoMachine.Migrations
{
    public partial class UpdateModel_111017 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OverTimeEnd",
                table: "TaskMachineHasOverTime");

            migrationBuilder.DropColumn(
                name: "OverTimeStart",
                table: "TaskMachineHasOverTime");

            migrationBuilder.AddColumn<string>(
                name: "EmpCode",
                table: "TaskMachineHasOverTime",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "OverTimeDate",
                table: "TaskMachineHasOverTime",
                type: "datetime2",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TaskMachineHasOverTime_EmpCode",
                table: "TaskMachineHasOverTime",
                column: "EmpCode");

            migrationBuilder.AddForeignKey(
                name: "FK_TaskMachineHasOverTime_Employee_EmpCode",
                table: "TaskMachineHasOverTime",
                column: "EmpCode",
                principalTable: "Employee",
                principalColumn: "EmpCode",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TaskMachineHasOverTime_Employee_EmpCode",
                table: "TaskMachineHasOverTime");

            migrationBuilder.DropIndex(
                name: "IX_TaskMachineHasOverTime_EmpCode",
                table: "TaskMachineHasOverTime");

            migrationBuilder.DropColumn(
                name: "EmpCode",
                table: "TaskMachineHasOverTime");

            migrationBuilder.DropColumn(
                name: "OverTimeDate",
                table: "TaskMachineHasOverTime");

            migrationBuilder.AddColumn<DateTime>(
                name: "OverTimeEnd",
                table: "TaskMachineHasOverTime",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "OverTimeStart",
                table: "TaskMachineHasOverTime",
                nullable: true);
        }
    }
}
