﻿using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

using VipcoMachine.Models;

namespace VipcoMachine.ViewModels
{
    public class OverTimeViewModel:TaskMachineHasOverTime
    {
        public string NameThai { get; set; }
    }
}
