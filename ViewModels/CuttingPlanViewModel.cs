using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VipcoMachine.Models;

namespace VipcoMachine.ViewModels
{
    public class CuttingPlanViewModel:CuttingPlan
    {
        public string ProjectCodeString { get; set; }
        public string TypeCuttingPlanString { get; set; }
    }
}
