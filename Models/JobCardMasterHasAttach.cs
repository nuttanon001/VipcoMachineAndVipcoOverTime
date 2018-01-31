using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

using System.ComponentModel.DataAnnotations;
namespace VipcoMachine.Models
{
    public class JobCardMasterHasAttach
    {
        [Key]
        public int JobMasterHasAttachId { get; set; }
        public string Creator { get; set; }
        public DateTime? CreateDate { get; set; }
        public string Modifyer { get; set; }
        public DateTime? ModifyDate { get; set; }

        //FK
        // JobCardMaster
        public int? JobCardMasterId { get; set; }
        public JobCardMaster JobCardMaster { get; set; }

        // AttachFile
        public int? AttachFileId { get; set; }
        public AttachFile AttachFile { get; set; }
    }
}
