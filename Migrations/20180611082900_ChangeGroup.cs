using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace VipcoMachine.Migrations
{
    public partial class ChangeGroup : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MatchGroupMisToGroupSage",
                columns: table => new
                {
                    MatchGroupId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    NewGroupMis = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OldGroupMis = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MatchGroupMisToGroupSage", x => x.MatchGroupId);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MatchGroupMisToGroupSage");
        }
    }
}
