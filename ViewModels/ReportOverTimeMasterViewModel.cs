using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace VipcoMachine.ViewModels
{
    public class ReportOverTimeMasterViewModel
    {
        public string DateOverTime { get; set; }
        public string GroupName { get; set; }
        public string JobNumber { get; set; }
        public int OneTime { get; set; }
        public int OnePointFiveTime { get; set; }
        public int TwoTime { get; set; }
        public int ThreeTime { get; set; }
        public int TypeWeekDay { get; set; }
        public int TypeWeekEnd { get; set; }
        public string LastPlan { get; set; }
        public string LastActual { get; set; }
        public string NowPlan { get; set; }
        public int Total { get; set; }
        public string RequireBy { get; set; }
        public string ApproverBy { get; set; }

        // ReportOverTimeDetail ViewModel
        public ICollection<ReportOverTimeDetailViewModel> Details { get; set; }
    }
}
