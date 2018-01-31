using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace VipcoMachine.Models
{
    public class EmployeeGroup
    {
        [Key]
        public string GroupCode { get; set; }
        [StringLength(200)]
        public string Description { get; set; }
        [StringLength(200)]
        public string Remark { get; set; }

        //FK
        //OverTimeMaster
        public ICollection<OverTimeMaster> OverTimeMasters { get; set; }
        //JobCardMaster
        public ICollection<JobCardMaster> JobCardMasters { get; set; }
    }
}
