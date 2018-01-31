using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace VipcoMachine.Models
{
    public class OverTimeDetail
    {
        [Key]
        public int OverTimeDetailId { get; set; }
        [Required]
        public double TotalHour { get; set; }
        [StringLength(500)]
        public string Remark { get; set; }
        public int? StartOverTime { get; set; }
        public OverTimeDetailStatus? OverTimeDetailStatus { get; set; }
        public string Creator { get; set; }
        public DateTime? CreateDate { get; set; }
        public string Modifyer { get; set; }
        public DateTime? ModifyDate { get; set; }

        //FK
        // OverTimeMaster
        public int? OverTimeMasterId { get; set; }
        public OverTimeMaster OverTimeMaster { get; set; }
        // Employee
        public string EmpCode { get; set; }
        public Employee Employee { get; set; }
    }

    public enum OverTimeDetailStatus
    {
        Use = 1,
        Cancel = 2
    }
}
