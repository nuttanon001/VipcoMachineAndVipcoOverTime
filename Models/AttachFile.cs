using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace VipcoMachine.Models
{
    public class AttachFile
    {
        [Key]
        public int AttachFileId { get; set; }
        [StringLength(100)]
        public string FileName { get; set; }
        [StringLength(250)]
        [Required]
        public string FileAddress { get; set; }
        public string Creator { get; set; }
        public DateTime? CreateDate { get; set; }
        public string Modifyer { get; set; }
        public DateTime? ModifyDate { get; set; }

        //FK
        public ICollection<JobCardMasterHasAttach> JobCardMasterHasAttachs { get; set; }
    }
}
