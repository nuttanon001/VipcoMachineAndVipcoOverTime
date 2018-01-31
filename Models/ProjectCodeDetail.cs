using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace VipcoMachine.Models
{
    /// <summary>
    /// Project Level 2-3
    /// </summary>
    public class ProjectCodeDetail
    {
        [Key]
        public int ProjectCodeDetailId { get; set; }
        [Required]
        [StringLength(100)]
        public string ProjectCodeDetailCode { get; set; }
        [StringLength(200)]
        public string Description { get; set; }
        public string Creator { get; set; }
        public DateTime? CreateDate { get; set; }
        public string Modifyer { get; set; }
        public DateTime? ModifyDate { get; set; }

        //FK
        //ProjectCodeMaster
        public int? ProjectCodeMasterId { get; set; }
        public ProjectCodeMaster ProjectCodeMaster { get; set; }
        //CuttingPlan
        public ICollection<CuttingPlan> CuttingPlans { get; set; }
        //JobCardMaster
        public ICollection<JobCardMaster> JobCardMasters { get; set; }
        //Don't use
        //public ICollection<JobCardDetail> JobCardDetails { get; set; }
    }
}
