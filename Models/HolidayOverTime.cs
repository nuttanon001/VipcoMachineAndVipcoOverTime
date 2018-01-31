using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace VipcoMachine.Models
{
    public class HolidayOverTime
    {
        [Key]
        public int HolidayId { get; set; }
        [StringLength(100)]
        public string HolidayName { get; set; }
        public DateTime? HolidayDate { get; set; }
        public HolidayStatus HolidayStatus { get; set; }
        public string Creator { get; set; }
        public DateTime? CreateDate { get; set; }
        public string Modifyer { get; set; }
        public DateTime? ModifyDate { get; set; }
    }

    public enum HolidayStatus
    {
        User = 1,
        Change = 2,
        Cancel = 3,
    }
}


