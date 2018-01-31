using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace VipcoMachine.Models
{
    public class StandardTime
    {
        [Key]
        public int StandardTimeId { get; set; }
        [Required]
        [StringLength(50)]
        public string StandardTimeCode { get; set; }
        [StringLength(250)]
        public string Description { get; set; }
        public string Remark { get; set; }
        /// <summary>
        /// ((StandardTimeValue + PreparationBefor + PreparationAfter) * Quantity) = Total Time
        /// </summary>
        public double? StandardTimeValue { get; set; }
        public double? PreparationBefor { get; set; }
        public double? PreparationAfter { get; set; }
        public double? CalculatorTime => (PreparationBefor ?? 0) + (StandardTimeValue ?? 0) + (PreparationAfter ?? 0);
        public string Creator { get; set; }
        public DateTime? CreateDate { get; set; }
        public string Modifyer { get; set; }
        public DateTime? ModifyDate { get; set; }

        //Fk
        // GradeMaterial
        public int? GradeMaterialId { get; set; }
        public GradeMaterial GradeMaterial { get; set; }
        // TypeStandardTime
        public int? TypeStandardTimeId { get; set; }
        public TypeStandardTime TypeStandardTime { get; set; }
        // JobCardDetail
        public ICollection<JobCardDetail> JobCardDetails { get; set; }
    }
}
