using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace VipcoMachine.Models
{
    public class ClassificationMaterial
    {
        [Key]
        public int ClassificationId { get; set; }
        [StringLength(25)]
        [Required]
        public string ClassificationCode { get; set; }
        [StringLength(100)]
        public string Description { get; set; }
        public string Creator { get; set; }
        public DateTime? CreateDate { get; set; }
        public string Modifyer { get; set; }
        public DateTime? ModifyDate { get; set; }

    }
}
