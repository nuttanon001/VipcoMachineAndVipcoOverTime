using AutoMapper;
using VipcoMachine.Models;
using VipcoMachine.ViewModels;

namespace VipcoMachine.Helpers
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            #region Employee

            // Employee
            CreateMap<Employee, EmployeeViewModel>()
                // TypeMachine
                .ForMember(x => x.TypeEmployeeString,
                           o => o.MapFrom(s => s.TypeEmployee == null ? "ไม่ระบุ" :
                           (s.TypeEmployee.Value == TypeEmployee.พนักงานตามโครงการ ? "พนักงานตามโครงการ" :
                           (s.TypeEmployee.Value == TypeEmployee.พนักงานทดลองงาน ? "พนักงานทดลองงาน" :
                           (s.TypeEmployee.Value == TypeEmployee.พนักงานประจำรายชั่วโมง ? "พนักงานประจำรายชั่วโมง" :
                           (s.TypeEmployee.Value == TypeEmployee.พนักงานประจำรายเดือน ? "พนักงานประจำรายเดือน" : "พนักงานพม่า"))))));
            CreateMap<EmployeeViewModel, Employee>();
            // EmployeeMis
            CreateMap<Employee, EmployeeMisViewModel>()
                .ForMember(x => x.GroupName,
                           o => o.MapFrom(s => s.EmployeeGroupMIS == null ? "ไม่ระบุ" : s.EmployeeGroupMIS.GroupDesc));
            CreateMap<EmployeeMisViewModel, Employee>();

            #endregion

            #region JobCardMaster

            // JobCardMaster
            CreateMap<JobCardMaster, JobCardMasterViewModel>()
                // JobCardMasterStatus
                .ForMember(x => x.StatusString,
                           o => o.MapFrom(s => s.JobCardMasterStatus == null ? "-" : s.JobCardMasterStatus == JobCardMasterStatus.Wait ? "In-Process" :
                                                                                    (s.JobCardMasterStatus == JobCardMasterStatus.Complete ? "Complete" : "Cancel")))
                // TypeMachine
                .ForMember(x => x.TypeMachineString,
                           o => o.MapFrom(s => s.TypeMachine == null ? "-" : $"{s.TypeMachine.TypeMachineCode}/{s.TypeMachine.Name}"))
                .ForMember(x => x.TypeMachine, o => o.Ignore())
                // ProjectCodeDetail
                .ForMember(x => x.ProjectDetailString,
                           o => o.MapFrom(s => s.ProjectCodeDetail == null ? "-" : $"{s.ProjectCodeDetail.ProjectCodeMaster.ProjectCode}/{s.ProjectCodeDetail.ProjectCodeDetailCode}"))
                .ForMember(x => x.ProjectCodeDetail, o => o.Ignore())
                // EmployeeWrite
                .ForMember(x => x.EmployeeWriteString,
                           o => o.MapFrom(s => s.EmployeeWrite == null ? "-" : $"{s.EmployeeWrite.EmpCode} {s.EmployeeWrite.NameThai}"))
                .ForMember(x => x.EmployeeWrite, o => o.Ignore())
                // EmployeeRequire
                .ForMember(x => x.EmployeeRequireString,
                           o => o.MapFrom(s => s.EmployeeGroup == null ? "-" : $"{s.EmployeeGroup.Description}"))
                .ForMember(x => x.EmployeeGroup, o => o.Ignore())
                .ForMember(x => x.EmployeeRequire, o => o.Ignore());
            CreateMap<JobCardMasterViewModel, JobCardMaster>();

            #endregion JobCardMaster

            #region JobCardDetail

            //JobCardDetail
            CreateMap<JobCardDetail, JobCardDetailViewModel>()
                // TypeMachine
                .ForMember(x => x.TypeMachineString,
                           o => o.MapFrom(s => s.JobCardMaster == null ? "-" : s.JobCardMaster.TypeMachine.TypeMachineCode))
                // JobMasterNo
                .ForMember(x => x.JobMasterNoString,
                           o => o.MapFrom(s => s.JobCardMaster == null ? "-" : s.JobCardMaster.JobCardMasterNo))
                // FullName
                .ForMember(x => x.FullNameString,
                           o => o.MapFrom(s => s.JobCardMaster.ProjectCodeDetail.ProjectCodeMaster.ProjectCode + "/ " +
                                               s.JobCardMaster.ProjectCodeDetail.ProjectCodeDetailCode))
                // UnitMeasure
                .ForMember(x => x.UnitsMeasureString,
                           o => o.MapFrom(s => s.UnitsMeasure == null ? "-" : s.UnitsMeasure.UnitMeasureName))
                .ForMember(x => x.UnitsMeasure, o => o.Ignore())
                // StandardTime
                .ForMember(x => x.StandardTimeString,
                           o => o.MapFrom(s => s.StandardTime == null ? "-" : $"{s.StandardTime.GradeMaterial.GradeName} - {s.StandardTime.StandardTimeCode}"))
                .ForMember(x => x.StandardTime, o => o.Ignore())
                // CuttingPlan
                .ForMember(x => x.CuttingPlanString,
                           o => o.MapFrom(s => s.CuttingPlan == null ? "-" : s.CuttingPlan.CuttingPlanNo + (s.UnitNo != null ? $" | Unit.{s.UnitNo}" : "")))
                .ForMember(x => x.CuttingPlan, o => o.Ignore());

            CreateMap<JobCardDetailViewModel, JobCardDetail>();

            #endregion JobCardDetail

            #region Operator

            //Operator
            CreateMap<MachineHasOperator, OperatorViewModel>()
                .ForMember(x => x.EmployeeName,
                           o => o.MapFrom(s => s.Employee == null ? "-" : $"{s.Employee.NameThai}"))
                .ForMember(x => x.Employee, o => o.Ignore());
            CreateMap<OperatorViewModel, MachineHasOperator>();

            #endregion Operator

            #region Machine

            //Machine
            CreateMap<Machine, MachineViewModel>()
                //TypeMachine
                .ForMember(x => x.TypeMachineString,
                           o => o.MapFrom(s => s.TypeMachine == null ? "-" : $"{s.TypeMachine.TypeMachineCode} - {s.TypeMachine.Name}"))
                .ForMember(x => x.TypeMachine, o => o.Ignore());
            CreateMap<MachineViewModel, Machine>();

            #endregion Machine

            #region CuttingPlan

            //CuttingPlan
            CreateMap<CuttingPlan, CuttingPlanViewModel>()
                // TypeCuttingPlanString
                .ForMember(x => x.TypeCuttingPlanString,
                           o => o.MapFrom(s => s.TypeCuttingPlan == null ? "-" : s.TypeCuttingPlan == 1 ? "CuttingPlan" : "ShopDrawing"))
                // ProjectCodeDetail
                .ForMember(x => x.ProjectCodeString,
                           o => o.MapFrom(s => s.ProjectCodeDetail == null ? "-" : $"{s.ProjectCodeDetail.ProjectCodeMaster.ProjectCode}/{s.ProjectCodeDetail.ProjectCodeDetailCode}"))
                .ForMember(x => x.ProjectCodeDetail, o => o.Ignore());

            CreateMap<CuttingPlanViewModel, CuttingPlan>();

            #endregion CuttingPlan

            #region ProjectCodeDetail

            //ProjectCodeDetail
            CreateMap<ProjectCodeDetail, ProjectCodeDetailViewModel>()
                    // ProjectCodeMaster
                    .ForMember(x => x.FullProjectLevelString,
                               o => o.MapFrom(s => s.ProjectCodeMaster == null ? "-" : $"{s.ProjectCodeMaster.ProjectCode}/{s.ProjectCodeDetailCode}"))
                    .ForMember(x => x.ProjectCodeMaster, o => o.Ignore());

            CreateMap<ProjectCodeDetailViewModel, ProjectCodeDetail>();

            #endregion ProjectCodeDetail

            #region StandardTime
            //StandardTime
            CreateMap<StandardTime, StandardTimeViewModel>()
                //TypeStandardTime
                .ForMember(x => x.TypeStandardTimeString,
                           o => o.MapFrom(s => s.TypeStandardTime == null ? "-" : $"{s.TypeStandardTime.Name}"))
                .ForMember(x => x.TypeStandardTime,o => o.Ignore())
                //GradeMaterial
                .ForMember(x => x.GradeMaterialString,
                           o => o.MapFrom(s => s.GradeMaterial == null ? "-" : s.GradeMaterial.GradeName))
                .ForMember(x => x.GradeMaterial, o => o.Ignore());

            CreateMap<StandardTimeViewModel, StandardTime>();
            #endregion

            #region TypeStandardTime
            //TypeStandardTime
            CreateMap<TypeStandardTime, TypeStandardTimeViewModel>()
                // TypeMachine
                .ForMember(x => x.TypeMachineString,
                           o => o.MapFrom(s => s.TypeMachine == null ? "-" : $"{s.TypeMachine.TypeMachineCode}/{s.TypeMachine.Name}"))
                .ForMember(x => x.TypeMachine, o => o.Ignore());

            CreateMap<TypeStandardTimeViewModel, TypeStandardTime>();
            #endregion

            #region TaskMachine

            //TaskMachine
            CreateMap<TaskMachine, TaskMachineViewModel>()
                // CuttingPlanNo
                .ForMember(x => x.CuttingPlanNo,
                           o => o.MapFrom(s => s.JobCardDetail.CuttingPlan == null ? "-" : s.JobCardDetail.CuttingPlan.CuttingPlanNo))
                .ForMember(x => x.JobCardDetail, o => o.Ignore())
                // Machine
                .ForMember(x => x.MachineString,
                           o => o.MapFrom(s => s.Machine == null ? "-" : $"{ s.Machine.MachineCode}/{ s.Machine.MachineName}"))
                .ForMember(x => x.Machine, o => o.Ignore())
                // Employee
                .ForMember(x => x.AssignedByString,
                           o => o.MapFrom(s => s.Employee == null ? "-" : s.Employee.NameThai))
                .ForMember(x => x.Employee, o => o.Ignore());

            CreateMap<TaskMachineViewModel, TaskMachine>();

            #endregion

            #region TaskMachineHasOverTime
            //TaskMachineHasOverTime
            CreateMap<TaskMachineHasOverTime, OverTimeViewModel>()
                // CuttingPlanNo
                .ForMember(x => x.NameThai,
                           o => o.MapFrom(s => s.Employee == null ? "-" : s.Employee.NameThai))
                .ForMember(x => x.Employee, o => o.Ignore());
            #endregion

            #region User
            //User
            CreateMap<User, UserViewModel>()
                // CuttingPlanNo
                .ForMember(x => x.NameThai,
                           o => o.MapFrom(s => s.Employee == null ? "-" : $"คุณ{s.Employee.NameThai}"))
                .ForMember(x => x.Employee, o => o.Ignore());

            #endregion

            #region OverTimeMaster
            // OverTimeMaster
            CreateMap<OverTimeMaster, OverTimeMasterViewModel>()
                // StatusString
                .ForMember(x => x.StatusString,
                           o => o.MapFrom(s => s.OverTimeStatus == null ? "Wait" :
                          (s.OverTimeStatus == OverTimeStatus.Required ? "Required" :
                          (s.OverTimeStatus == OverTimeStatus.WaitActual ? "In-Complate" :
                          (s.OverTimeStatus == OverTimeStatus.Complate ? "Complate" : "Cancel")))))
                // EmployeeGroup
                .ForMember(x => x.GroupString,
                           o => o.MapFrom(s => s.EmployeeGroup == null ? "-" : s.EmployeeGroup.Description))
                .ForMember(x => x.EmployeeGroup, o => o.Ignore())
                // EmployeeGroupMis
                .ForMember(x => x.GroupMisString,
                           o => o.MapFrom(s => s.EmployeeGroupMIS == null ? "" : s.EmployeeGroupMIS.GroupDesc))
                .ForMember(x => x.EmployeeGroupMIS, o => o.Ignore())
                // ProjectCodeMaster
                .ForMember(x => x.ProjectMasterString,
                           o => o.MapFrom(s => s.ProjectCodeMaster == null ? "-" : $"{s.ProjectCodeMaster.ProjectCode}/{s.ProjectCodeMaster.ProjectName}"))
                .ForMember(x => x.ProjectCodeMaster, o => o.Ignore())
                // Require
                .ForMember(x => x.RequireString,
                           o => o.MapFrom(s => s.RequireBy == null ? "-" : $"คุณ{s.RequireBy.NameThai}"))
                .ForMember(x => x.RequireBy,o => o.Ignore())
                // Approve
                .ForMember(x => x.ApproveString,
                           o => o.MapFrom(s => s.ApproveBy == null ? "-" : $"คุณ{s.ApproveBy.NameThai}"))
                .ForMember(x => x.ApproveBy, o => o.Ignore());

            CreateMap<OverTimeMasterViewModel, OverTimeMaster>();
            #endregion

            #region OverTimeDetail

            CreateMap<OverTimeDetail, OverTimeDetailViewModel>()
                // Status
                .ForMember(x => x.StatusString,
                           o => o.MapFrom(s => s.OverTimeDetailStatus == null ? "Use" : (s.OverTimeDetailStatus == OverTimeDetailStatus.Use ? "Use" : "Cancel")))
                // Employee
                .ForMember(x => x.EmployeeString,
                           o => o.MapFrom(s => s.Employee == null ? "-" : $"คุณ{s.Employee.NameThai}"))
                .ForMember(x => x.Employee, o => o.Ignore());

            CreateMap<OverTimeDetailViewModel, OverTimeDetail>();
            #endregion

            #region NoTaskMachine

            CreateMap<NoTaskMachine, NoTaskMachineViewModel>()
                // AssignedBy
                .ForMember(x => x.AssignedByString,
                           o => o.MapFrom(s => s.Employee == null ? "-" : $"คุณ{s.Employee.NameThai}"))
                .ForMember(x => x.Employee, o => o.Ignore())
                // CuttingPlne
                .ForMember(x => x.CuttingPlanNo,
                           o => o.MapFrom(s => s.JobCardDetail.CuttingPlan == null ? "-" : s.JobCardDetail.CuttingPlan.CuttingPlanNo ))
                .ForMember(x => x.JobCardDetail,o => o.Ignore())
                // EmployeeMisGroup
                .ForMember(x => x.GroupMisString,
                           o => o.MapFrom(s => s.EmployeeGroupMIS == null ? "-" : s.EmployeeGroupMIS.GroupDesc))
                .ForMember(x => x.EmployeeGroupMIS, o => o.Ignore())
                // EmployeeGroup
                .ForMember(x => x.GroupCodeString,
                            o => o.MapFrom(s => s.EmployeeGroup == null ? "-" : s.EmployeeGroup.Description))
                .ForMember(x => x.EmployeeGroup, o => o.Ignore());

            CreateMap<NoTaskMachineViewModel, NoTaskMachine>();
            #endregion
        }
    }
}