using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

using Microsoft.EntityFrameworkCore;

namespace VipcoMachine.Models
{
    public class ApplicationContext : DbContext
    {
        public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options)
        { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AttachFile>().ToTable("AttachFile");
            modelBuilder.Entity<ClassificationMaterial>().ToTable("ClassificationMaterial");
            modelBuilder.Entity<CuttingPlan>().ToTable("CuttingPlan");
            modelBuilder.Entity<Employee>().ToTable("Employee");
            modelBuilder.Entity<GradeMaterial>().ToTable("GradeMaterial");
            modelBuilder.Entity<EmployeeGroup>().ToTable("EmployeeGroup");
            modelBuilder.Entity<EmployeeGroupMIS>().ToTable("EmployeeGroupMIS");
            modelBuilder.Entity<JobCardDetail>().ToTable("JobCardDetail");
            modelBuilder.Entity<JobCardMaster>().ToTable("JobCardMaster");
            modelBuilder.Entity<JobCardMasterHasAttach>().ToTable("JobCardMasterHasAttach");
            modelBuilder.Entity<Machine>().ToTable("Machines");
            modelBuilder.Entity<MachineHasOperator>().ToTable("MachineHasOperator");
            modelBuilder.Entity<MatchGroupMisToGroupSage>().ToTable("MatchGroupMisToGroupSage");
            // material
            modelBuilder.Entity<Material>().ToTable("Material");
            //set key
            //modelBuilder.Entity<Material>()
            //    .HasAlternateKey(m => m.Size)
            //    .HasName("Unique_Size");
            modelBuilder.Entity<OverTimeDetail>().ToTable("OverTimeDetail");
            modelBuilder.Entity<OverTimeMaster>().ToTable("OverTimeMaster");
            modelBuilder.Entity<HolidayOverTime>().ToTable("HolidayOverTime");
            modelBuilder.Entity<Permission>().ToTable("Permission");
            modelBuilder.Entity<ProjectCodeDetail>().ToTable("ProjectCodeDetail");
            modelBuilder.Entity<ProjectCodeMaster>().ToTable("ProjectCodeMaster");
            modelBuilder.Entity<PropertyMachine>().ToTable("PropertyMachine");
            modelBuilder.Entity<StandardTime>().ToTable("StandardTime");
            modelBuilder.Entity<TaskMachine>().ToTable("TaskMachine");
            modelBuilder.Entity<NoTaskMachine>().ToTable("NoTaskMachine");
            modelBuilder.Entity<TypeMachine>().ToTable("TypeMachine");
            modelBuilder.Entity<TaskMachineHasOverTime>().ToTable("TaskMachineHasOverTime");
            modelBuilder.Entity<TemplateProjectDetail>().ToTable("TemplateProjectDetail");
            modelBuilder.Entity<TypeStandardTime>().ToTable("TypeStandardTime");
            modelBuilder.Entity<UnitsMeasure>().ToTable("UnitsMeasure");
            modelBuilder.Entity<User>().ToTable("User");
            modelBuilder.Entity<WorkGroupHasWorkShop>().ToTable("WorkGroupHasWorkShop");
            modelBuilder.Entity<WorkShop>().ToTable("WorkShop");
            modelBuilder.Entity<EmployeeLocation>().ToTable("EmployeeLocations");

        }

        //public DbSet<AttachFile> AttachFiles { get; set; }
        public DbSet<AttachFile> AttachFiles { get; set; }
        public DbSet<ClassificationMaterial> ClassificationMaterials { get; set; }
        public DbSet<CuttingPlan> CuttingPlans { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<GradeMaterial> GradeMaterials { get; set; }
        public DbSet<EmployeeGroup> EmpoyeeGroups { get; set; }
        public DbSet<EmployeeGroupMIS> EmployeeGroupMISs { get; set; }
        public DbSet<EmployeeLocation> EmployeeLocations { get; set; }
        public DbSet<JobCardDetail> JobCardDetails { get; set; }
        public DbSet<JobCardMaster> JobCardMasters { get; set; }
        public DbSet<JobCardMasterHasAttach> JobCardMasterHasAttachs { get; set; }
        public DbSet<Machine> Machines { get; set; }
        public DbSet<MachineHasOperator> MachineHasOperators { get; set; }
        public DbSet<MatchGroupMisToGroupSage> MatchGroupMisToGroupSages { get; set; }
        public DbSet<Material> Materials { get; set; }
        public DbSet<HolidayOverTime> HolidayOverTimes { get; set; }
        public DbSet<OverTimeDetail> OverTimeDetails { get; set; }
        public DbSet<OverTimeMaster> OverTimeMasters { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<ProjectCodeDetail> ProjectCodeDetails { get; set; }
        public DbSet<ProjectCodeMaster> ProjectCodeMasters { get; set; }
        public DbSet<PropertyMachine> PropertyMachines { get; set; }
        public DbSet<StandardTime> StandardTimes { get; set; }
        public DbSet<TaskMachine> TaskMachines { get; set; }
        public DbSet<NoTaskMachine> NoTaskMachines { get; set; }
        public DbSet<TaskMachineHasOverTime> TaskMachineHasOverTimes { get; set; }
        public DbSet<TemplateProjectDetail> TemplateProjectDetails { get; set; }
        public DbSet<TypeMachine> TypeMachines { get; set; }
        public DbSet<TypeStandardTime> TypeStandardTimes { get; set; }
        public DbSet<UnitsMeasure> UnitsMeasures { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<WorkGroupHasWorkShop> WorkGroupHasWorkShops { get; set; }
        public DbSet<WorkShop> WorkShops { get; set; }
    }
}
