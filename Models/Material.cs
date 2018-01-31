using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace VipcoMachine.Models
{
    public class Material
    {
        [Key]
        public int MaterialId { get; set; }
        [StringLength(200)]
        public string Name { get; set; }
        [StringLength(200)]
        public string Size { get; set; }
        [StringLength(200)]
        public string Grade { get; set; }
        public string Creator { get; set; }
        public DateTime? CreateDate { get; set; }
        public string Modifyer { get; set; }
        public DateTime? ModifyDate { get; set; }
        // Fk
        //CuttingPlan
        //ICollection<CuttingPlan> CuttingPlans { get; set; }
    }
}
