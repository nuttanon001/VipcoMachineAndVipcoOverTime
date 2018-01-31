using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VipcoMachine.ViewModels
{
    public class OptionChartOTViewModel
    {
        public int? ProjectMaster { get; set; }
        public DateTime? SelectedDate { get; set; }
        public string GroupCode { get; set; }
        public int? TypeChart { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
