using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VipcoMachine.ViewModels
{
    public class OptionOverTimeSchedule
    {
        public string Filter { get; set; }
        public string GroupCode { get; set; }
        public int? ProjectMasterId { get; set; }
        public string Create { get; set; }
        public DateTime? SDate { get; set; }
        public DateTime? EDate { get; set; }
        public int? Skip { get; set; }
        public int? Take { get; set; }
        /// <summary>
        /// Required = 1,
        /// WaitActual = 2,
        /// Complate = 3,
        /// Cancel = 4
        /// </summary>
        public int? Status { get; set; }
    }
}
