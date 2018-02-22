using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VipcoMachine.Models
{
    public class JobCardMaster
    {
        [Key]
        public int JobCardMasterId { get; set; }
        [StringLength(50)]
        public string JobCardMasterNo { get; set; }
        public JobCardMasterStatus? JobCardMasterStatus { get; set; }
        [StringLength(200)]
        public string Description { get; set; }
        [StringLength(200)]
        public string Remark { get; set; }
        public DateTime? JobCardDate { get; set; }
        public DateTime? DueDate { get; set; }
        public string Creator { get; set; }
        public DateTime? CreateDate { get; set; }
        public string Modifyer { get; set; }
        public DateTime? ModifyDate { get; set; }

        //FK
        // EmployeeWrite
        public string EmpWrite { get; set; }
        [ForeignKey("EmpWrite")]
        public Employee EmployeeWrite { get; set; }
        // EmployeeRequire
        public string EmpRequire { get; set; }
        [ForeignKey("EmpRequire")]
        public Employee EmployeeRequire { get; set; }
        // GroupCode
        public string GroupCode { get; set; }
        public EmployeeGroup EmployeeGroup { get; set; }
        // ProjectCodeDetail
        public int? ProjectCodeDetailId { get; set; }
        public ProjectCodeDetail ProjectCodeDetail { get; set; }
        // TypeMachine
        public int? TypeMachineId { get; set; }
        public TypeMachine TypeMachine { get; set; }
        // JobCardDetail
        public ICollection<JobCardDetail> JobCardDetails { get; set; }
        // JobCardMasterHasAttach
        public ICollection<JobCardMasterHasAttach> JobCardMasterHasAttachs { get; set; }
    }
    public enum JobCardMasterStatus
    {
        Wait = 1,
        Complete = 2,
        Cancel = 3,
        InProcess = 4,
    }
}
