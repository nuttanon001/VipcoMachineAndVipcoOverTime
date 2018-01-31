using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace VipcoMachine.Models
{
    public class EmployeeGroupMIS
    {
        [Key]
        [StringLength(100)]
        public string GroupMIS { get; set; }

        [StringLength(250)]
        public string GroupDesc { get; set; }
        [StringLength(250)]
        public string Remark { get; set; }

        //FK
        //Employee
        public ICollection<Employee> Employees { get; set; }
        //OverTimeMaster
        public ICollection<OverTimeMaster> OverTimeMasters { get; set; }
        // NoTaskMachine
        public ICollection<NoTaskMachine> NoTaskMachines { get; set; }
    }
}
