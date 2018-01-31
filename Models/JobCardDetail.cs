using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace VipcoMachine.Models
{
    public class JobCardDetail
    {
        [Key]
        public int JobCardDetailId { get; set; }
        [StringLength(200)]
        public string Material { get; set; }
        /// <summary>
        /// Material Quality
        /// </summary>
        public double? Quality { get; set; }
        public int? UnitNo { get; set; }
        public JobCardDetailStatus? JobCardDetailStatus { get; set; }
        [StringLength(200)]
        public string Remark { get; set; }
        public string Creator { get; set; }
        public DateTime? CreateDate { get; set; }
        public string Modifyer { get; set; }
        public DateTime? ModifyDate { get; set; }

        //Fk
        // JobCardMaster
        public int? JobCardMasterId { get; set; }
        public JobCardMaster JobCardMaster { get; set; }
        // UnitMeasure
        public int? UnitMeasureId { get; set; }
        public UnitsMeasure UnitsMeasure { get; set; }
        // TaskMachine
        //public int? TaskMachineId { get; set; }
        //public TaskMachine TaskMachine { get; set; }
        // StandardTime
        public int? StandardTimeId { get; set; }
        public StandardTime StandardTime { get; set; }
        // CuttingPlan
        public int? CuttingPlanId { get; set; }
        public CuttingPlan CuttingPlan { get; set; }
        // Don't use
        //public int? ProjectCodeDetailId { get; set; }
        //public ProjectCodeDetail ProjectCodeDetail { get; set; }
    }
    public enum JobCardDetailStatus
    {
        Wait = 1,
        Task = 2,
        Cancel = 3
    }
}
