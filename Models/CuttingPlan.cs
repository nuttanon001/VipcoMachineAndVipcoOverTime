using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace VipcoMachine.Models
{
    public class CuttingPlan
    {
        [Key]
        public int CuttingPlanId { get; set; }
        [Required]
        public string CuttingPlanNo { get; set; }
        public string Description { get; set; }
        public double? Quantity { get; set; }
        public string MaterialSize { get; set; }
        public string MaterialGrade { get; set; }
        /// <summary>
        /// 1:Cutting Plan
        /// 2:Shop Drawing
        /// </summary>
        public int? TypeCuttingPlan { get; set; }
        public string Creator { get; set; }
        public DateTime? CreateDate { get; set; }
        public string Modifyer { get; set; }
        public DateTime? ModifyDate { get; set; }

        //FK
        // ProjectCodeDetail
        public int? ProjectCodeDetailId { get; set; }
        public ProjectCodeDetail ProjectCodeDetail { get; set; }
        // Material
        //public int? MaterialId { get; set; }
        //public Material Material { get; set; }
        // JobCardDetail
        public ICollection<JobCardDetail> JobCardDetails { get; set; }
    }
}
