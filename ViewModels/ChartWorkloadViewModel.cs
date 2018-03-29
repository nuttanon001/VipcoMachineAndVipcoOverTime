using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VipcoMachine.ViewModels
{
    public class ChartWorkloadViewModel
    {
        public string MonthName { get; set; }
        public List<WorkLoadData> WorkLoadDatas { get; set; }
    }

    public class WorkLoadData
    {
        public string MachineNo { get; set; }
        public double WorkDay { get; set; }
        public double TotalDay { get; set; }
        public double Percent => (WorkDay / TotalDay) * 100;
    }
}
