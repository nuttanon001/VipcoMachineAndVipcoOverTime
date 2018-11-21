using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace VipcoMachine.Models
{
    public class EmployeeLocation
    {
        [Key]
        public int RowId { get; set; }
        public string EmpCode { get; set; }
        public string LocationCode { get; set; }
    }
}
