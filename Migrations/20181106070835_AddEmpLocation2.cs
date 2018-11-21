using Microsoft.EntityFrameworkCore.Migrations;

namespace VipcoMachine.Migrations
{
    public partial class AddEmpLocation2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EmployeeLocations_Employee_EmpCode",
                table: "EmployeeLocations");

            migrationBuilder.DropIndex(
                name: "IX_EmployeeLocations_EmpCode",
                table: "EmployeeLocations");

            migrationBuilder.AlterColumn<string>(
                name: "EmpCode",
                table: "EmployeeLocations",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "EmpCode",
                table: "EmployeeLocations",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_EmployeeLocations_EmpCode",
                table: "EmployeeLocations",
                column: "EmpCode");

            migrationBuilder.AddForeignKey(
                name: "FK_EmployeeLocations_Employee_EmpCode",
                table: "EmployeeLocations",
                column: "EmpCode",
                principalTable: "Employee",
                principalColumn: "EmpCode",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
