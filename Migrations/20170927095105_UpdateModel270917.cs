using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace VipcoMachine.Migrations
{
    public partial class UpdateModel270917 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CuttingPlan_Material_MaterialId",
                table: "CuttingPlan");

            migrationBuilder.DropForeignKey(
                name: "FK_JobCardDetail_Material_MaterialId",
                table: "JobCardDetail");

            migrationBuilder.DropForeignKey(
                name: "FK_JobCardDetail_ProjectCodeDetail_ProjectCodeDetailId",
                table: "JobCardDetail");

            migrationBuilder.DropForeignKey(
                name: "FK_JobCardMaster_ProjectCodeMaster_ProjectCodeMasterId",
                table: "JobCardMaster");

            migrationBuilder.DropForeignKey(
                name: "FK_Material_ClassificationMaterial_ClassificationId",
                table: "Material");

            migrationBuilder.DropForeignKey(
                name: "FK_Material_GradeMaterial_GradeMaterialId",
                table: "Material");

            migrationBuilder.DropForeignKey(
                name: "FK_Material_TypeStandardTime_TypeStandardTimeId",
                table: "Material");

            migrationBuilder.DropForeignKey(
                name: "FK_StandardTime_Material_MaterialId",
                table: "StandardTime");

            migrationBuilder.DropIndex(
                name: "IX_TaskMachineHasOverTime_TaskMachineId",
                table: "TaskMachineHasOverTime");

            migrationBuilder.DropIndex(
                name: "IX_TaskMachine_JobCardDetailId",
                table: "TaskMachine");

            migrationBuilder.DropIndex(
                name: "IX_StandardTime_MaterialId",
                table: "StandardTime");

            migrationBuilder.DropIndex(
                name: "IX_Material_ClassificationId",
                table: "Material");

            migrationBuilder.DropIndex(
                name: "IX_Material_GradeMaterialId",
                table: "Material");

            migrationBuilder.DropIndex(
                name: "IX_Material_TypeStandardTimeId",
                table: "Material");

            migrationBuilder.DropIndex(
                name: "IX_JobCardMaster_ProjectCodeMasterId",
                table: "JobCardMaster");

            migrationBuilder.DropIndex(
                name: "IX_JobCardDetail_MaterialId",
                table: "JobCardDetail");

            migrationBuilder.DropIndex(
                name: "IX_JobCardDetail_ProjectCodeDetailId",
                table: "JobCardDetail");

            migrationBuilder.DropIndex(
                name: "IX_CuttingPlan_MaterialId",
                table: "CuttingPlan");

            migrationBuilder.DropColumn(
                name: "SubName",
                table: "TypeStandardTime");

            migrationBuilder.DropColumn(
                name: "MaterialId",
                table: "StandardTime");

            migrationBuilder.DropColumn(
                name: "ClassificationId",
                table: "Material");

            migrationBuilder.DropColumn(
                name: "GradeMaterialId",
                table: "Material");

            migrationBuilder.DropColumn(
                name: "TypeStandardTimeId",
                table: "Material");

            migrationBuilder.DropColumn(
                name: "ProjectCodeMasterId",
                table: "JobCardMaster");

            migrationBuilder.DropColumn(
                name: "MaterialId",
                table: "JobCardDetail");

            migrationBuilder.DropColumn(
                name: "ProjectCodeDetailId",
                table: "JobCardDetail");

            migrationBuilder.DropColumn(
                name: "GradeCode",
                table: "GradeMaterial");

            migrationBuilder.DropColumn(
                name: "GradeSubCode",
                table: "GradeMaterial");

            migrationBuilder.DropColumn(
                name: "MaterialId",
                table: "CuttingPlan");

            migrationBuilder.AddColumn<int>(
                name: "TypeMachineId",
                table: "TypeStandardTime",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "StandardTime",
                type: "nvarchar(250)",
                maxLength: 250,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 150,
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "GradeMaterialId",
                table: "StandardTime",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ProjectCodeDetailId",
                table: "JobCardMaster",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TypeMachineId",
                table: "JobCardMaster",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Material",
                table: "JobCardDetail",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GradeName",
                table: "GradeMaterial",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "TypeCuttingPlan",
                table: "CuttingPlan",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TypeStandardTime_TypeMachineId",
                table: "TypeStandardTime",
                column: "TypeMachineId");

            migrationBuilder.CreateIndex(
                name: "IX_TaskMachineHasOverTime_TaskMachineId",
                table: "TaskMachineHasOverTime",
                column: "TaskMachineId");

            migrationBuilder.CreateIndex(
                name: "IX_TaskMachine_JobCardDetailId",
                table: "TaskMachine",
                column: "JobCardDetailId");

            migrationBuilder.CreateIndex(
                name: "IX_StandardTime_GradeMaterialId",
                table: "StandardTime",
                column: "GradeMaterialId");

            migrationBuilder.CreateIndex(
                name: "IX_JobCardMaster_ProjectCodeDetailId",
                table: "JobCardMaster",
                column: "ProjectCodeDetailId");

            migrationBuilder.CreateIndex(
                name: "IX_JobCardMaster_TypeMachineId",
                table: "JobCardMaster",
                column: "TypeMachineId");

            migrationBuilder.AddForeignKey(
                name: "FK_JobCardMaster_ProjectCodeDetail_ProjectCodeDetailId",
                table: "JobCardMaster",
                column: "ProjectCodeDetailId",
                principalTable: "ProjectCodeDetail",
                principalColumn: "ProjectCodeDetailId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_JobCardMaster_TypeMachine_TypeMachineId",
                table: "JobCardMaster",
                column: "TypeMachineId",
                principalTable: "TypeMachine",
                principalColumn: "TypeMachineId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_StandardTime_GradeMaterial_GradeMaterialId",
                table: "StandardTime",
                column: "GradeMaterialId",
                principalTable: "GradeMaterial",
                principalColumn: "GradeMaterialId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TypeStandardTime_TypeMachine_TypeMachineId",
                table: "TypeStandardTime",
                column: "TypeMachineId",
                principalTable: "TypeMachine",
                principalColumn: "TypeMachineId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_JobCardMaster_ProjectCodeDetail_ProjectCodeDetailId",
                table: "JobCardMaster");

            migrationBuilder.DropForeignKey(
                name: "FK_JobCardMaster_TypeMachine_TypeMachineId",
                table: "JobCardMaster");

            migrationBuilder.DropForeignKey(
                name: "FK_StandardTime_GradeMaterial_GradeMaterialId",
                table: "StandardTime");

            migrationBuilder.DropForeignKey(
                name: "FK_TypeStandardTime_TypeMachine_TypeMachineId",
                table: "TypeStandardTime");

            migrationBuilder.DropIndex(
                name: "IX_TypeStandardTime_TypeMachineId",
                table: "TypeStandardTime");

            migrationBuilder.DropIndex(
                name: "IX_TaskMachineHasOverTime_TaskMachineId",
                table: "TaskMachineHasOverTime");

            migrationBuilder.DropIndex(
                name: "IX_TaskMachine_JobCardDetailId",
                table: "TaskMachine");

            migrationBuilder.DropIndex(
                name: "IX_StandardTime_GradeMaterialId",
                table: "StandardTime");

            migrationBuilder.DropIndex(
                name: "IX_JobCardMaster_ProjectCodeDetailId",
                table: "JobCardMaster");

            migrationBuilder.DropIndex(
                name: "IX_JobCardMaster_TypeMachineId",
                table: "JobCardMaster");

            migrationBuilder.DropColumn(
                name: "TypeMachineId",
                table: "TypeStandardTime");

            migrationBuilder.DropColumn(
                name: "GradeMaterialId",
                table: "StandardTime");

            migrationBuilder.DropColumn(
                name: "ProjectCodeDetailId",
                table: "JobCardMaster");

            migrationBuilder.DropColumn(
                name: "TypeMachineId",
                table: "JobCardMaster");

            migrationBuilder.DropColumn(
                name: "Material",
                table: "JobCardDetail");

            migrationBuilder.DropColumn(
                name: "GradeName",
                table: "GradeMaterial");

            migrationBuilder.DropColumn(
                name: "TypeCuttingPlan",
                table: "CuttingPlan");

            migrationBuilder.AddColumn<string>(
                name: "SubName",
                table: "TypeStandardTime",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "StandardTime",
                maxLength: 150,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(250)",
                oldMaxLength: 250,
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaterialId",
                table: "StandardTime",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ClassificationId",
                table: "Material",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "GradeMaterialId",
                table: "Material",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TypeStandardTimeId",
                table: "Material",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ProjectCodeMasterId",
                table: "JobCardMaster",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaterialId",
                table: "JobCardDetail",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ProjectCodeDetailId",
                table: "JobCardDetail",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GradeCode",
                table: "GradeMaterial",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GradeSubCode",
                table: "GradeMaterial",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaterialId",
                table: "CuttingPlan",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TaskMachineHasOverTime_TaskMachineId",
                table: "TaskMachineHasOverTime",
                column: "TaskMachineId",
                unique: true,
                filter: "[TaskMachineId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_TaskMachine_JobCardDetailId",
                table: "TaskMachine",
                column: "JobCardDetailId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_StandardTime_MaterialId",
                table: "StandardTime",
                column: "MaterialId",
                unique: true,
                filter: "[MaterialId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Material_ClassificationId",
                table: "Material",
                column: "ClassificationId");

            migrationBuilder.CreateIndex(
                name: "IX_Material_GradeMaterialId",
                table: "Material",
                column: "GradeMaterialId");

            migrationBuilder.CreateIndex(
                name: "IX_Material_TypeStandardTimeId",
                table: "Material",
                column: "TypeStandardTimeId");

            migrationBuilder.CreateIndex(
                name: "IX_JobCardMaster_ProjectCodeMasterId",
                table: "JobCardMaster",
                column: "ProjectCodeMasterId");

            migrationBuilder.CreateIndex(
                name: "IX_JobCardDetail_MaterialId",
                table: "JobCardDetail",
                column: "MaterialId");

            migrationBuilder.CreateIndex(
                name: "IX_JobCardDetail_ProjectCodeDetailId",
                table: "JobCardDetail",
                column: "ProjectCodeDetailId");

            migrationBuilder.CreateIndex(
                name: "IX_CuttingPlan_MaterialId",
                table: "CuttingPlan",
                column: "MaterialId");

            migrationBuilder.AddForeignKey(
                name: "FK_CuttingPlan_Material_MaterialId",
                table: "CuttingPlan",
                column: "MaterialId",
                principalTable: "Material",
                principalColumn: "MaterialId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_JobCardDetail_Material_MaterialId",
                table: "JobCardDetail",
                column: "MaterialId",
                principalTable: "Material",
                principalColumn: "MaterialId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_JobCardDetail_ProjectCodeDetail_ProjectCodeDetailId",
                table: "JobCardDetail",
                column: "ProjectCodeDetailId",
                principalTable: "ProjectCodeDetail",
                principalColumn: "ProjectCodeDetailId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_JobCardMaster_ProjectCodeMaster_ProjectCodeMasterId",
                table: "JobCardMaster",
                column: "ProjectCodeMasterId",
                principalTable: "ProjectCodeMaster",
                principalColumn: "ProjectCodeMasterId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Material_ClassificationMaterial_ClassificationId",
                table: "Material",
                column: "ClassificationId",
                principalTable: "ClassificationMaterial",
                principalColumn: "ClassificationId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Material_GradeMaterial_GradeMaterialId",
                table: "Material",
                column: "GradeMaterialId",
                principalTable: "GradeMaterial",
                principalColumn: "GradeMaterialId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Material_TypeStandardTime_TypeStandardTimeId",
                table: "Material",
                column: "TypeStandardTimeId",
                principalTable: "TypeStandardTime",
                principalColumn: "TypeStandardTimeId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_StandardTime_Material_MaterialId",
                table: "StandardTime",
                column: "MaterialId",
                principalTable: "Material",
                principalColumn: "MaterialId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
