using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VipcoMachine.Models
{
    public class TypeStandardTime
    {
        [Key]
        public int TypeStandardTimeId { get; set; }
        [Required]
        [StringLength(50)]
        public string Name { get; set; }
        public string Creator { get; set; }
        public DateTime? CreateDate { get; set; }
        public string Modifyer { get; set; }
        public DateTime? ModifyDate { get; set; }

        //Fk
        // TypeMachine
        public int? TypeMachineId { get; set; }
        public TypeMachine TypeMachine { get; set; }
        // StandardTime
        public ICollection<StandardTime> StandardTimes { get; set; }
    }
}
