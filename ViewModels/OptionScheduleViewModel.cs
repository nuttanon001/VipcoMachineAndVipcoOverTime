using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VipcoMachine.ViewModels
{
    public class OptionScheduleViewModel
    {
        public string Filter { get; set; }
        public int? TypeMachineId { get; set; }
        public int? JobNo { get; set; }
        public int? Level2 { get; set; }
        public int? Skip { get; set; }
        public int? Take { get; set; }
        /// <summary>
        /// 1 : Mode 1
        /// null or 2 : Wait and Process
        /// </summary>
        public int? Mode { get; set; }
        public string Creator { get; set; }
        public string Require { get; set; }
        public int? TaskMachineId { get; set; }
        public int? MachineId { get; set; }

        public DateTime? PickDate { get; set; }
    }
}
