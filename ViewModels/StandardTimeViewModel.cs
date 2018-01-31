using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

using VipcoMachine.Models;
namespace VipcoMachine.ViewModels
{
    public class StandardTimeViewModel:StandardTime
    {
        public string GradeMaterialString { get; set; }
        public string TypeStandardTimeString { get; set; }
    }
}
