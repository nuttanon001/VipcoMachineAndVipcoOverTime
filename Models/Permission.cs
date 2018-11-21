using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace VipcoMachine.Models
{
    public class Permission:BaseModel
    {
        [Key]
        public int PermissionId { get; set; }
        /// <summary>
        /// User FK from Table User in MachineDataBase
        /// </summary>
        public int UserId { get; set; }
        public double LevelPermission { get; set; }
    }
}
