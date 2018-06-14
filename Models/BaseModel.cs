using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VipcoMachine.Models
{
    public class BaseModel
    {
        public string Creator { get; set; }
        public DateTime? CreateDate { get; set; }
        public string Modifyer { get; set; }
        public DateTime? ModifyDate { get; set; }
    }
}
