using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace VipcoMachine.Models
{
    public class MachineHasOperator
    {
        [Key]
        public int MachineOperatorId { get; set; }
        [StringLength(100)]
        public string Remark { get; set; }
        public string Creator { get; set; }
        public DateTime? CreateDate { get; set; }
        public string Modifyer { get; set; }
        public DateTime? ModifyDate { get; set; }

        //FK
        public string EmpCode { get; set; }
        public Employee Employee { get; set; }
        public int? MachineId { get; set; }
        public Machine Machine { get; set; }
    }
}
