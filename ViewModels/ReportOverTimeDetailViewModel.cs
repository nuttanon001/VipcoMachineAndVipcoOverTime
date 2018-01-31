using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VipcoMachine.ViewModels
{
    public class ReportOverTimeDetailViewModel
    {
        public int RowNumber { get; set; }
        public string Name { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public int HourOverTime { get; set; }
        public string Remark { get; set; }
    }
}
