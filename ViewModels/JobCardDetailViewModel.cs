using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

using VipcoMachine.Models;

namespace VipcoMachine.ViewModels
{
    public class JobCardDetailViewModel:JobCardDetail
    {
        public string TypeMachineString { get; set; }
        public string JobMasterNoString { get; set; }
        public string UnitsMeasureString { get; set; }
        public string CuttingPlanString { get; set; }
        public string StandardTimeString { get; set; }
        public string FullNameString { get; set; }
        public string StatusString =>
            !this.JobCardDetailStatus.HasValue ? "-" :
            (this.JobCardDetailStatus.Value == Models.JobCardDetailStatus.Wait ? "Wait" :
            (this.JobCardDetailStatus.Value == Models.JobCardDetailStatus.Cancel ? "Cancel" : "Task"));

    }
}
