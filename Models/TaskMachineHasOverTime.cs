using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
namespace VipcoMachine.Models
{
    public class TaskMachineHasOverTime
    {
        [Key]
        public int OverTimeId { get; set; }
        [MaxLength(200)]
        public string Description { get; set; }
        public DateTime? OverTimeDate { get; set; }
        /// <summary>
        /// How many overtime per day ex: 4 hr. per 1 day
        /// </summary>
        public double? OverTimePerDate { get; set; }
        public string Creator { get; set; }
        public DateTime? CreateDate { get; set; }
        public string Modifyer { get; set; }
        public DateTime? ModifyDate { get; set; }
        //FK
        // TaskMachine
        public int? TaskMachineId { get; set; }
        public TaskMachine TaskMachine { get; set; }
        //Employee
        public string EmpCode { get; set; }
        public Employee Employee { get; set; }
    }
}
