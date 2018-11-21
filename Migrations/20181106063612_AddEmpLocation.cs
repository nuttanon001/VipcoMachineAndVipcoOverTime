using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace VipcoMachine.Migrations
{
    public partial class AddEmpLocation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EmployeeLocations",
                columns: table => new
                {
                    RowId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    EmpCode = table.Column<string>(nullable: true),
                    LocationCode = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmployeeLocations", x => x.RowId);
                    table.ForeignKey(
                        name: "FK_EmployeeLocations_Employee_EmpCode",
                        column: x => x.EmpCode,
                        principalTable: "Employee",
                        principalColumn: "EmpCode",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EmployeeLocations_EmpCode",
                table: "EmployeeLocations",
                column: "EmpCode");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EmployeeLocations");
        }
    }
}
