using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace VipcoMachine.Models
{
    public class UnitsMeasure
    {
        [Key]
        public int UnitMeasureId { get; set; }
        [Required]
        [StringLength(25)]
        public string UnitMeasureName { get; set; }
        public string Creator { get; set; }
        public DateTime? CreateDate { get; set; }
        public string Modifyer { get; set; }
        public DateTime? ModifyDate { get; set; }
        //FK
        public ICollection<PropertyMachine> PropertyMachines { get; set; }
        public ICollection<JobCardDetail> JobCardDetails { get; set; }
    }
}
