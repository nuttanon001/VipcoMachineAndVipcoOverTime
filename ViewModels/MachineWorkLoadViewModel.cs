using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VipcoMachine.ViewModels
{
    public class MachineWorkLoadViewModel
    {
        public string MachineCode { get; set; }
        public ICollection<DateTime> DateTimes { get; set; }
        /// <summary>
        /// month number two digit and year number two digit xx/xx
        /// </summary>
        public string MonthYear { get; set; }
    }
}
