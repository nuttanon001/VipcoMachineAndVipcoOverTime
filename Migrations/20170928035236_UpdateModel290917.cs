using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace VipcoMachine.Migrations
{
    public partial class UpdateModel290917 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "JobCardMasterHasAttach",
                columns: table => new
                {
                    JobMasterHasAttachId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    AttachFileId = table.Column<int>(type: "int", nullable: true),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Creator = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    JobCardMasterId = table.Column<int>(type: "int", nullable: true),
                    ModifyDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Modifyer = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobCardMasterHasAttach", x => x.JobMasterHasAttachId);
                    table.ForeignKey(
                        name: "FK_JobCardMasterHasAttach_AttachFile_AttachFileId",
                        column: x => x.AttachFileId,
                        principalTable: "AttachFile",
                        principalColumn: "AttachFileId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_JobCardMasterHasAttach_JobCardMaster_JobCardMasterId",
                        column: x => x.JobCardMasterId,
                        principalTable: "JobCardMaster",
                        principalColumn: "JobCardMasterId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_JobCardMasterHasAttach_AttachFileId",
                table: "JobCardMasterHasAttach",
                column: "AttachFileId");

            migrationBuilder.CreateIndex(
                name: "IX_JobCardMasterHasAttach_JobCardMasterId",
                table: "JobCardMasterHasAttach",
                column: "JobCardMasterId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "JobCardMasterHasAttach");
        }
    }
}
