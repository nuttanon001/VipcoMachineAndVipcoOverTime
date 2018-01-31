using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VipcoMachine.Models
{
    public class NoTaskMachine
    {
        [Key]
        public int NoTaskMachineId { get; set; }
        [StringLength(50)]
        public string NoTaskMachineCode { get; set; }
        [StringLength(200)]
        public string Description { get; set; }
        [StringLength(200)]
        public string Remark { get; set; }
        public double? Quantity { get; set; }
        public DateTime? Date { get; set; }
        public string Creator { get; set; }
        public DateTime? CreateDate { get; set; }
        public string Modifyer { get; set; }
        public DateTime? ModifyDate { get; set; }

        // FK
        // JobCardDetail
        [Required]
        public int JobCardDetailId { get; set; }
        public JobCardDetail JobCardDetail { get; set; }
        // Employee
        public string AssignedBy { get; set; }
        [ForeignKey("AssignedBy")]
        public Employee Employee { get; set; }
        // EmployeeGroup
        public string GroupCode { get; set; }
        public EmployeeGroup EmployeeGroup { get; set; }
        // EmployeeGroupMis
        public string GroupMis { get; set; }
        public EmployeeGroupMIS EmployeeGroupMIS { get; set; }

    }
}
