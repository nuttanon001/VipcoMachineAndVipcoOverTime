using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VipcoMachine.ViewModels
{
    public class PlanViewModel
    {
        public DateTime? PlannedStartDate { get; set; }
        public DateTime? PlannedEndDate { get; set; }
        public int? Quantity { get; set; }
        public int? StandardTimeId { get; set; }
    }
}
