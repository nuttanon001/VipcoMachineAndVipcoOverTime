using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VipcoMachine.ViewModels
{
    public class PageViewModelcs
    {
        //The current page number
        public int? PageNumber { get; set; }
        //The total number of pages
        public int? TotalPages { get; set; }
        //The total number of elements
        public int? TotalElements { get; set; }
        //The number of elements in the page
        public int? Size { get; set; }
        public string SortField { get; set; }
        public int? SortOrder { get; set; }
        public string Filter { get; set; }
    }
}
