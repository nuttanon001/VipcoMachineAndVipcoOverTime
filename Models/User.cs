using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace VipcoMachine.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        [Required]
        [StringLength(50)]
        public string UserName { get; set; }
        [Required]
        [StringLength(50)]
        public string PassWord { get; set; }
        public LevelUser LevelUser { get; set; }
        [StringLength(100)]
        public string MailAddress { get; set; }
        public string Creator { get; set; }
        public DateTime? CreateDate { get; set; }
        public string Modifyer { get; set; }
        public DateTime? ModifyDate { get; set; }

        // FK
        public string EmpCode { get; set; }
        public Employee Employee { get; set; }
    }

    public enum LevelUser
    {
        RequiredLevel = 1,
        MachineLevel = 2,
        Administrator = 3,
    }
}
