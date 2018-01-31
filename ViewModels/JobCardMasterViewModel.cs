using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

using VipcoMachine.Models;
namespace VipcoMachine.ViewModels
{
    public class JobCardMasterViewModel: JobCardMaster
    {
        public string ProjectDetailString { get; set; }
        public string TypeMachineString { get; set; }
        public string StatusString { get; set; }
        public string EmployeeRequireString { get; set; }
        public string EmployeeWriteString { get; set; }
    }
}
