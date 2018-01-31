using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VipcoMachine.ViewModels
{
    public class ScrollViewModel
    {
        //The Skip number
        public int? Skip { get; set; }
        //The Take number
        public int? Take { get; set; }
        public string SortField { get; set; }
        public int? SortOrder { get; set; }
        public string Filter { get; set; }
        public bool? Reload { get; set; }
        public string Where { get; set; }
    }
}
