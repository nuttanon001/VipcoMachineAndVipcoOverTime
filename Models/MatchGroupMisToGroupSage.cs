using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace VipcoMachine.Models
{
    public class MatchGroupMisToGroupSage
    {
        [Key]
        public int MatchGroupId { get; set; }
        public string OldGroupMis { get; set; }
        public string NewGroupMis { get; set; }
    }
}
