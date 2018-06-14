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

    public class ReportOverTimeSummaryByWorkShop
    {
        public string WorkShopName { get; set; }
        public ICollection<ReportOverTimeSummaryWithShop> ReportOverTimeSummaries { get; set; }
        public int TotalShop1 => ReportOverTimeSummaries.Any() ? ReportOverTimeSummaries.Sum(x => x.TotalShop1) : 0;
        public int TotalShop2 => ReportOverTimeSummaries.Any() ? ReportOverTimeSummaries.Sum(x => x.TotalShop2) : 0;
    }

    public class ReportOverTimeSummaryWithShop
    {
        public string ProjectNumber { get; set; }
        public string GroupNameShop1 { get; set; }
        public string GroupNameShop2 { get; set; }
        public int TotalShop1 { get; set; }
        public int TotalShop2 { get; set; }
        public int TotalLine => TotalShop1 + TotalShop2;
        public string Remark { get; set; }
    }
}
