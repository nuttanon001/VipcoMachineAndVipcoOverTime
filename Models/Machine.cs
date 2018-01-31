using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace VipcoMachine.Models
{
    public class Machine
    {
        [Key]
        public int MachineId { get; set; }
        [Required]
        [StringLength(50)]
        public string MachineCode { get; set; }
        [Required]
        [StringLength(200)]
        public string MachineName { get; set; }
        public DateTime? InstalledDate { get; set; }
        [StringLength(50)]
        public string Model { get; set; }
        [StringLength(50)]
        public string Brand { get; set; }
        public byte[] MachineImage { get; set; }
        public string MachineImageString { get; set; }
        [StringLength(200)]
        public string Remark { get; set; }
        public MachineStatus? MachineStatus { get; set; }
        public string Creator { get; set; }
        public DateTime? CreateDate { get; set; }
        public string Modifyer { get; set; }
        public DateTime? ModifyDate { get; set; }

        //FK
        // TypeMachine
        public int? TypeMachineId { get; set; }
        public TypeMachine TypeMachine { get; set; }
        // PropertyMachine
        public ICollection<PropertyMachine> PropertyMachines { get; set; }
        // MachineHasOperator
        public ICollection<MachineHasOperator> MachineHasOperators { get; set; }
        // TaskMachine
        public ICollection<TaskMachine> TaskMachines { get; set; }
    }

    public enum MachineStatus
    {
        Ready = 1,
        Repair = 2,
        Failure = 3
    }
}
