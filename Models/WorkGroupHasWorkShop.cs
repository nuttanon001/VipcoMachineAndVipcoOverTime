using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace VipcoMachine.Models
{
    public class WorkGroupHasWorkShop:BaseModel
    {
        [Key]
        public int WorkGroupHasWorkShopId { get; set; }
        [StringLength(50)]
        public string TeamName { get; set; }
        // Relation
        //WorkShop
        public int WorkShopId { get; set; }
        public WorkShop WorkShop { get; set; }
        //EmployeeGroupMis
        public string GroupMIS { get; set; }
        public EmployeeGroupMIS EmployeeGroupMIS { get; set; }
    }
}
