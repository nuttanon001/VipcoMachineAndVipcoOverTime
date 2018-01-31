using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace VipcoMachine.Models
{
    public class TypeMachine
    {
        [Key]
        public int TypeMachineId { get; set; }
        [StringLength(25)]
        public string TypeMachineCode { get; set; }
        [StringLength(50)]
        public string Name { get; set; }
        [StringLength(200)]
        public string Description { get; set; }
        [StringLength(200)]
        public string Remark { get; set; }
        public string Creator { get; set; }
        public DateTime? CreateDate { get; set; }
        public string Modifyer { get; set; }
        public DateTime? ModifyDate { get; set; }
        // FK
        public ICollection<Machine> Machines { get; set; }
        public ICollection<JobCardMaster> JobCardMasters { get; set; }
        public ICollection<TypeStandardTime> TypeStandardTimes { get; set; }
    }
}
