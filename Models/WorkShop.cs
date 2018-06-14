using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace VipcoMachine.Models
{
    public class WorkShop:BaseModel
    {
        [Key]
        public int WorkShopId { get; set; }
        [StringLength(200)]
        public string WorkShopName { get; set; }
        [StringLength(200)]
        public string Remark { get; set; }
        //Relation
        //WorkGroupHasWorkShop
        public ICollection<WorkGroupHasWorkShop> WorkGroupHasWorkShop { get; set; }
    }
}
