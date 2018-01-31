using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

using VipcoMachine.Models;

namespace VipcoMachine.ViewModels
{
    public class OverTimeMasterViewModel:OverTimeMaster
    {
        public string ApproveString { get; set; }
        public string RequireString { get; set; }
        public string GroupString { get; set; }
        public string GroupMisString { get; set; }
        public string ProjectMasterString { get; set; }
        public string StatusString { get; set; }
    }
}
