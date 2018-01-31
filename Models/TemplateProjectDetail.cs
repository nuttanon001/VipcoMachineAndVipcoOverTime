using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace VipcoMachine.Models
{
    public class TemplateProjectDetail
    {
        [Key]
        public int TemplateProjectDetailId { get; set; }
        public string TemplateName { get; set; }
        public string Creator { get; set; }
        public DateTime? CreateDate { get; set; }
        public string Modifyer { get; set; }
        public DateTime? ModifyDate { get; set; }
    }
}
