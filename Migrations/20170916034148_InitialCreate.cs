using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace VipcoMachine.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AttachFile",
                columns: table => new
                {
                    AttachFileId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Creator = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FileAddress = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    FileName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    ModifyDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Modifyer = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AttachFile", x => x.AttachFileId);
                });

            migrationBuilder.CreateTable(
                name: "ClassificationMaterial",
                columns: table => new
                {
                    ClassificationId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ClassificationCode = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Creator = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    ModifyDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Modifyer = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClassificationMaterial", x => x.ClassificationId);
                });

            migrationBuilder.CreateTable(
                name: "Employee",
                columns: table => new
                {
                    EmpCode = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    NameEng = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    NameThai = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    TypeEmployee = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employee", x => x.EmpCode);
                });

            migrationBuilder.CreateTable(
                name: "GradeMaterial",
                columns: table => new
                {
                    GradeMaterialId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Creator = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GradeCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    GradeSubCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ModifyDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Modifyer = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GradeMaterial", x => x.GradeMaterialId);
                });

            migrationBuilder.CreateTable(
                name: "ProjectCodeMaster",
                columns: table => new
                {
                    ProjectCodeMasterId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Creator = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ModifyDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Modifyer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProjectCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ProjectName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectCodeMaster", x => x.ProjectCodeMasterId);
                });

            migrationBuilder.CreateTable(
                name: "TemplateProjectDetail",
                columns: table => new
                {
                    TemplateProjectDetailId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Creator = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ModifyDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Modifyer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TemplateName = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TemplateProjectDetail", x => x.TemplateProjectDetailId);
                });

            migrationBuilder.CreateTable(
                name: "TypeMachine",
                columns: table => new
                {
                    TypeMachineId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Creator = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    ModifyDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Modifyer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Remark = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    TypeMachineCode = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TypeMachine", x => x.TypeMachineId);
                });

            migrationBuilder.CreateTable(
                name: "TypeStandardTime",
                columns: table => new
                {
                    TypeStandardTimeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Creator = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ModifyDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Modifyer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    SubName = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TypeStandardTime", x => x.TypeStandardTimeId);
                });

            migrationBuilder.CreateTable(
                name: "UnitsMeasure",
                columns: table => new
                {
                    UnitMeasureId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Creator = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ModifyDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Modifyer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UnitMeasureName = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UnitsMeasure", x => x.UnitMeasureId);
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Creator = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EmpCode = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    MailAddress = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    ModifyDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Modifyer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PassWord = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_User_Employee_EmpCode",
                        column: x => x.EmpCode,
                        principalTable: "Employee",
                        principalColumn: "EmpCode",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "JobCardMaster",
                columns: table => new
                {
                    JobCardMasterId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Creator = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EmpRequire = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    EmpWrite = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    JobCardDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    JobCardMasterNo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    JobCardMasterStatus = table.Column<int>(type: "int", nullable: true),
                    ModifyDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Modifyer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProjectCodeMasterId = table.Column<int>(type: "int", nullable: true),
                    Remark = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobCardMaster", x => x.JobCardMasterId);
                    table.ForeignKey(
                        name: "FK_JobCardMaster_Employee_EmpRequire",
                        column: x => x.EmpRequire,
                        principalTable: "Employee",
                        principalColumn: "EmpCode",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_JobCardMaster_Employee_EmpWrite",
                        column: x => x.EmpWrite,
                        principalTable: "Employee",
                        principalColumn: "EmpCode",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_JobCardMaster_ProjectCodeMaster_ProjectCodeMasterId",
                        column: x => x.ProjectCodeMasterId,
                        principalTable: "ProjectCodeMaster",
                        principalColumn: "ProjectCodeMasterId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ProjectCodeDetail",
                columns: table => new
                {
                    ProjectCodeDetailId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Creator = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    ModifyDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Modifyer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProjectCodeDetailCode = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ProjectCodeMasterId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectCodeDetail", x => x.ProjectCodeDetailId);
                    table.ForeignKey(
                        name: "FK_ProjectCodeDetail_ProjectCodeMaster_ProjectCodeMasterId",
                        column: x => x.ProjectCodeMasterId,
                        principalTable: "ProjectCodeMaster",
                        principalColumn: "ProjectCodeMasterId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Machines",
                columns: table => new
                {
                    MachineId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Brand = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Creator = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    InstalledDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    MachineCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    MachineImage = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    MachineName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    MachineStatus = table.Column<int>(type: "int", nullable: true),
                    Model = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ModifyDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Modifyer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Remark = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    TypeMachineId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Machines", x => x.MachineId);
                    table.ForeignKey(
                        name: "FK_Machines_TypeMachine_TypeMachineId",
                        column: x => x.TypeMachineId,
                        principalTable: "TypeMachine",
                        principalColumn: "TypeMachineId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Material",
                columns: table => new
                {
                    MaterialId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ClassificationId = table.Column<int>(type: "int", nullable: true),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Creator = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    GradeMaterialId = table.Column<int>(type: "int", nullable: true),
                    Length = table.Column<double>(type: "float", nullable: true),
                    ModifyDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Modifyer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SquareMeter = table.Column<double>(type: "float", nullable: true),
                    Thickness = table.Column<double>(type: "float", nullable: true),
                    TypeStandardTimeId = table.Column<int>(type: "int", nullable: true),
                    Weight = table.Column<double>(type: "float", nullable: true),
                    Width = table.Column<double>(type: "float", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Material", x => x.MaterialId);
                    table.ForeignKey(
                        name: "FK_Material_ClassificationMaterial_ClassificationId",
                        column: x => x.ClassificationId,
                        principalTable: "ClassificationMaterial",
                        principalColumn: "ClassificationId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Material_GradeMaterial_GradeMaterialId",
                        column: x => x.GradeMaterialId,
                        principalTable: "GradeMaterial",
                        principalColumn: "GradeMaterialId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Material_TypeStandardTime_TypeStandardTimeId",
                        column: x => x.TypeStandardTimeId,
                        principalTable: "TypeStandardTime",
                        principalColumn: "TypeStandardTimeId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MachineHasOperator",
                columns: table => new
                {
                    MachineOperatorId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Creator = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EmpCode = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    MachineId = table.Column<int>(type: "int", nullable: true),
                    ModifyDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Modifyer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Remark = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MachineHasOperator", x => x.MachineOperatorId);
                    table.ForeignKey(
                        name: "FK_MachineHasOperator_Employee_EmpCode",
                        column: x => x.EmpCode,
                        principalTable: "Employee",
                        principalColumn: "EmpCode",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MachineHasOperator_Machines_MachineId",
                        column: x => x.MachineId,
                        principalTable: "Machines",
                        principalColumn: "MachineId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PropertyMachine",
                columns: table => new
                {
                    PropertyMachineId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Creator = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MachineId = table.Column<int>(type: "int", nullable: true),
                    ModifyDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Modifyer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PropertyName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Remark = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    UnitsMeasureUnitMeasureId = table.Column<int>(type: "int", nullable: true),
                    Value = table.Column<double>(type: "float", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyMachine", x => x.PropertyMachineId);
                    table.ForeignKey(
                        name: "FK_PropertyMachine_Machines_MachineId",
                        column: x => x.MachineId,
                        principalTable: "Machines",
                        principalColumn: "MachineId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PropertyMachine_UnitsMeasure_UnitsMeasureUnitMeasureId",
                        column: x => x.UnitsMeasureUnitMeasureId,
                        principalTable: "UnitsMeasure",
                        principalColumn: "UnitMeasureId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CuttingPlan",
                columns: table => new
                {
                    CuttingPlanId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Creator = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CuttingPlanNo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MaterialId = table.Column<int>(type: "int", nullable: true),
                    ModifyDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Modifyer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProjectCodeDetailId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CuttingPlan", x => x.CuttingPlanId);
                    table.ForeignKey(
                        name: "FK_CuttingPlan_Material_MaterialId",
                        column: x => x.MaterialId,
                        principalTable: "Material",
                        principalColumn: "MaterialId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CuttingPlan_ProjectCodeDetail_ProjectCodeDetailId",
                        column: x => x.ProjectCodeDetailId,
                        principalTable: "ProjectCodeDetail",
                        principalColumn: "ProjectCodeDetailId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "StandardTime",
                columns: table => new
                {
                    StandardTimeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Creator = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    MaterialId = table.Column<int>(type: "int", nullable: true),
                    ModifyDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Modifyer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PreparationAfter = table.Column<double>(type: "float", nullable: true),
                    PreparationBefor = table.Column<double>(type: "float", nullable: true),
                    Remark = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StandardTimeCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    StandardTimeValue = table.Column<double>(type: "float", nullable: true),
                    TypeStandardTimeId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StandardTime", x => x.StandardTimeId);
                    table.ForeignKey(
                        name: "FK_StandardTime_Material_MaterialId",
                        column: x => x.MaterialId,
                        principalTable: "Material",
                        principalColumn: "MaterialId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_StandardTime_TypeStandardTime_TypeStandardTimeId",
                        column: x => x.TypeStandardTimeId,
                        principalTable: "TypeStandardTime",
                        principalColumn: "TypeStandardTimeId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "JobCardDetail",
                columns: table => new
                {
                    JobCardDetailId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Creator = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CuttingPlanId = table.Column<int>(type: "int", nullable: true),
                    JobCardDetailStatus = table.Column<int>(type: "int", nullable: true),
                    JobCardMasterId = table.Column<int>(type: "int", nullable: true),
                    MaterialId = table.Column<int>(type: "int", nullable: true),
                    ModifyDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Modifyer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProjectCodeDetailId = table.Column<int>(type: "int", nullable: true),
                    Quality = table.Column<double>(type: "float", nullable: true),
                    Remark = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    UnitMeasureId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobCardDetail", x => x.JobCardDetailId);
                    table.ForeignKey(
                        name: "FK_JobCardDetail_CuttingPlan_CuttingPlanId",
                        column: x => x.CuttingPlanId,
                        principalTable: "CuttingPlan",
                        principalColumn: "CuttingPlanId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_JobCardDetail_JobCardMaster_JobCardMasterId",
                        column: x => x.JobCardMasterId,
                        principalTable: "JobCardMaster",
                        principalColumn: "JobCardMasterId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_JobCardDetail_Material_MaterialId",
                        column: x => x.MaterialId,
                        principalTable: "Material",
                        principalColumn: "MaterialId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_JobCardDetail_ProjectCodeDetail_ProjectCodeDetailId",
                        column: x => x.ProjectCodeDetailId,
                        principalTable: "ProjectCodeDetail",
                        principalColumn: "ProjectCodeDetailId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_JobCardDetail_UnitsMeasure_UnitMeasureId",
                        column: x => x.UnitMeasureId,
                        principalTable: "UnitsMeasure",
                        principalColumn: "UnitMeasureId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TaskMachine",
                columns: table => new
                {
                    TaskMachineId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ActualEndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ActualManHours = table.Column<double>(type: "float", nullable: true),
                    ActualStartDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AssignedBy = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Creator = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CurrentQuantity = table.Column<double>(type: "float", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    JobCardDetailId = table.Column<int>(type: "int", nullable: false),
                    MachineId = table.Column<int>(type: "int", nullable: true),
                    ModifyDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Modifyer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PlannedEndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PlannedStartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PrecedingTaskMachineId = table.Column<int>(type: "int", nullable: true),
                    Priority = table.Column<int>(type: "int", nullable: true),
                    TaskMachineName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    TotalQuantity = table.Column<double>(type: "float", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaskMachine", x => x.TaskMachineId);
                    table.ForeignKey(
                        name: "FK_TaskMachine_Employee_AssignedBy",
                        column: x => x.AssignedBy,
                        principalTable: "Employee",
                        principalColumn: "EmpCode",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TaskMachine_JobCardDetail_JobCardDetailId",
                        column: x => x.JobCardDetailId,
                        principalTable: "JobCardDetail",
                        principalColumn: "JobCardDetailId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TaskMachine_Machines_MachineId",
                        column: x => x.MachineId,
                        principalTable: "Machines",
                        principalColumn: "MachineId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TaskMachine_TaskMachine_PrecedingTaskMachineId",
                        column: x => x.PrecedingTaskMachineId,
                        principalTable: "TaskMachine",
                        principalColumn: "TaskMachineId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CuttingPlan_MaterialId",
                table: "CuttingPlan",
                column: "MaterialId");

            migrationBuilder.CreateIndex(
                name: "IX_CuttingPlan_ProjectCodeDetailId",
                table: "CuttingPlan",
                column: "ProjectCodeDetailId");

            migrationBuilder.CreateIndex(
                name: "IX_JobCardDetail_CuttingPlanId",
                table: "JobCardDetail",
                column: "CuttingPlanId");

            migrationBuilder.CreateIndex(
                name: "IX_JobCardDetail_JobCardMasterId",
                table: "JobCardDetail",
                column: "JobCardMasterId");

            migrationBuilder.CreateIndex(
                name: "IX_JobCardDetail_MaterialId",
                table: "JobCardDetail",
                column: "MaterialId");

            migrationBuilder.CreateIndex(
                name: "IX_JobCardDetail_ProjectCodeDetailId",
                table: "JobCardDetail",
                column: "ProjectCodeDetailId");

            migrationBuilder.CreateIndex(
                name: "IX_JobCardDetail_UnitMeasureId",
                table: "JobCardDetail",
                column: "UnitMeasureId");

            migrationBuilder.CreateIndex(
                name: "IX_JobCardMaster_EmpRequire",
                table: "JobCardMaster",
                column: "EmpRequire");

            migrationBuilder.CreateIndex(
                name: "IX_JobCardMaster_EmpWrite",
                table: "JobCardMaster",
                column: "EmpWrite");

            migrationBuilder.CreateIndex(
                name: "IX_JobCardMaster_ProjectCodeMasterId",
                table: "JobCardMaster",
                column: "ProjectCodeMasterId");

            migrationBuilder.CreateIndex(
                name: "IX_MachineHasOperator_EmpCode",
                table: "MachineHasOperator",
                column: "EmpCode");

            migrationBuilder.CreateIndex(
                name: "IX_MachineHasOperator_MachineId",
                table: "MachineHasOperator",
                column: "MachineId");

            migrationBuilder.CreateIndex(
                name: "IX_Machines_TypeMachineId",
                table: "Machines",
                column: "TypeMachineId");

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
                name: "IX_ProjectCodeDetail_ProjectCodeMasterId",
                table: "ProjectCodeDetail",
                column: "ProjectCodeMasterId");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyMachine_MachineId",
                table: "PropertyMachine",
                column: "MachineId");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyMachine_UnitsMeasureUnitMeasureId",
                table: "PropertyMachine",
                column: "UnitsMeasureUnitMeasureId");

            migrationBuilder.CreateIndex(
                name: "IX_StandardTime_MaterialId",
                table: "StandardTime",
                column: "MaterialId",
                unique: true,
                filter: "[MaterialId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_StandardTime_TypeStandardTimeId",
                table: "StandardTime",
                column: "TypeStandardTimeId");

            migrationBuilder.CreateIndex(
                name: "IX_TaskMachine_AssignedBy",
                table: "TaskMachine",
                column: "AssignedBy");

            migrationBuilder.CreateIndex(
                name: "IX_TaskMachine_JobCardDetailId",
                table: "TaskMachine",
                column: "JobCardDetailId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TaskMachine_MachineId",
                table: "TaskMachine",
                column: "MachineId");

            migrationBuilder.CreateIndex(
                name: "IX_TaskMachine_PrecedingTaskMachineId",
                table: "TaskMachine",
                column: "PrecedingTaskMachineId");

            migrationBuilder.CreateIndex(
                name: "IX_User_EmpCode",
                table: "User",
                column: "EmpCode");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AttachFile");

            migrationBuilder.DropTable(
                name: "MachineHasOperator");

            migrationBuilder.DropTable(
                name: "PropertyMachine");

            migrationBuilder.DropTable(
                name: "StandardTime");

            migrationBuilder.DropTable(
                name: "TaskMachine");

            migrationBuilder.DropTable(
                name: "TemplateProjectDetail");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropTable(
                name: "JobCardDetail");

            migrationBuilder.DropTable(
                name: "Machines");

            migrationBuilder.DropTable(
                name: "CuttingPlan");

            migrationBuilder.DropTable(
                name: "JobCardMaster");

            migrationBuilder.DropTable(
                name: "UnitsMeasure");

            migrationBuilder.DropTable(
                name: "TypeMachine");

            migrationBuilder.DropTable(
                name: "Material");

            migrationBuilder.DropTable(
                name: "ProjectCodeDetail");

            migrationBuilder.DropTable(
                name: "Employee");

            migrationBuilder.DropTable(
                name: "ClassificationMaterial");

            migrationBuilder.DropTable(
                name: "GradeMaterial");

            migrationBuilder.DropTable(
                name: "TypeStandardTime");

            migrationBuilder.DropTable(
                name: "ProjectCodeMaster");
        }
    }
}
