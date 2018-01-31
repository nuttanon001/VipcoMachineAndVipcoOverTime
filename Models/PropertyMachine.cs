using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace VipcoMachine.Models
{
    public class PropertyMachine
    {
        [Key]
        public int PropertyMachineId { get; set; }
        [Required]
        [StringLength(50)]
        public string PropertyName { get; set; }
        public double? Value { get; set; }
        [StringLength(200)]
        public string Remark { get; set; }
        public string Creator { get; set; }
        public DateTime? CreateDate { get; set; }
        public string Modifyer { get; set; }
        public DateTime? ModifyDate { get; set; }

        //FK
        // Machine
        public int? MachineId { get; set; }
        public Machine Machine { get; set; }
    }
}
