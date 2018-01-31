using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace VipcoMachine.ViewModels
{
    public class OptionLastOverTimeViewModel
    {
        public int? ProjectCodeId { get; set; }
        public string GroupCode { get; set; }
        public int? CurrentOverTimeId { get; set; }
        public string GroupMis { get; set; }

        public DateTime? BeForDate { get; set; }
    }
}
