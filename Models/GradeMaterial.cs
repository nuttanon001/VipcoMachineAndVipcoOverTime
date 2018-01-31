using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace VipcoMachine.Models
{
    public class GradeMaterial
    {
        [Key]
        public int GradeMaterialId { get; set; }
        [StringLength(50)]
        [Required]
        public string GradeName { get; set; }
        public string Creator { get; set; }
        public DateTime? CreateDate { get; set; }
        public string Modifyer { get; set; }
        public DateTime? ModifyDate { get; set; }

        //FK
        public ICollection<StandardTime> StandardTimes { get; set; }
    }
}
