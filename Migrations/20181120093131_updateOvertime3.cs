using Microsoft.EntityFrameworkCore.Migrations;

namespace VipcoMachine.Migrations
{
    public partial class updateOvertime3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LocationCode",
                table: "OverTimeMaster",
                maxLength: 10,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LocationCode",
                table: "OverTimeMaster");
        }
    }
}
