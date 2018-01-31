using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VipcoMachine.ViewModels
{
    public class ReportOverTimeSummary
    {
        public int Runing { get; set; }
        public string GroupName { get; set; }
        public int TotalOfGroup { get; set; }
        public int TotalOfOverTime { get; set; }
        public string ProjectNumber { get; set; }
        public string Remark { get; set; }
    }
}
