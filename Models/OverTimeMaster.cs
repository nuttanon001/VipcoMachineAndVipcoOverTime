using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VipcoMachine.Models
{
    public class OverTimeMaster
    {
        [Key]
        public int OverTimeMasterId { get; set; }
        [Required]
        public DateTime OverTimeDate { get; set; }
        [StringLength(500)]
        public string InfoPlan { get; set; }
        [StringLength(500)]
        public string InfoActual { get; set; }
        public OverTimeStatus? OverTimeStatus { get; set; }

        public string Creator { get; set; }
        public DateTime? CreateDate { get; set; }
        public string Modifyer { get; set; }
        public DateTime? ModifyDate { get; set; }

        // FK
        // Employee Approve
        public string EmpApprove { get; set; }
        [ForeignKey("EmpApprove")]
        public Employee ApproveBy { get; set; }
        // Employee Require
        public string EmpRequire { get; set; }
        [ForeignKey("EmpRequire")]
        public Employee RequireBy { get; set; }
        // OverTime
        public int? LastOverTimeId { get; set; }
        [ForeignKey("LastOverTimeId")]
        public OverTimeMaster LastOverTimeMaster { get; set; }
        // EmployeeGroup
        public string GroupCode { get; set; }
        public EmployeeGroup EmployeeGroup { get; set; }
        // EmployeeGroupMis
        public string GroupMIS { get; set; }
        public EmployeeGroupMIS EmployeeGroupMIS { get; set; }
        // ProjectMaster
        public int? ProjectCodeMasterId { get; set; }
        public ProjectCodeMaster ProjectCodeMaster { get; set; }
        // OverTimeDetail
        public ICollection<OverTimeDetail> OverTimeDetails { get; set; }
    }

    public enum OverTimeStatus
    {
        Required = 1,
        WaitActual = 2,
        Complate = 3,
        Cancel = 4
    }
}
