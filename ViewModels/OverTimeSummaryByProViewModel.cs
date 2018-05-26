using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VipcoMachine.ViewModels
{
    public class OverTimeSummaryByProViewModel
    {
        public string JobNumber { get; set; }
        public string JobName { get; set; }
        public double TotalHr { get; set; }
        public double TotalMan { get; set; }
    }
}
