using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace VipcoMachine.Models
{
    /// <summary>
    /// Project Level 1
    /// </summary>
    public class ProjectCodeMaster
    {
        [Key]
        public int ProjectCodeMasterId { get; set; }
        [Required]
        [StringLength(50)]
        public string ProjectCode { get; set; }
        [StringLength(200)]
        public string ProjectName { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Creator { get; set; }
        public DateTime? CreateDate { get; set; }
        public string Modifyer { get; set; }
        public DateTime? ModifyDate { get; set; }
        //Fk
        // ProjectCodeDetail
        public ICollection<ProjectCodeDetail> ProjectCodeDetails { get; set; }
        // OverTimeMaster
        public ICollection<OverTimeMaster> OverTimeMasters { get; set; }
    }
}
