using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

using VipcoMachine.Models;

namespace VipcoMachine.ViewModels
{
    public class PageDataViewModel<TEntity> where TEntity : class
    {
        public PageViewModelcs Page { get; private set; }
        public IEnumerable<TEntity> Data { get; private set; }

        public PageDataViewModel(PageViewModelcs page, IEnumerable<TEntity> data)
        {
            this.Page = page;
            this.Data = data;
        }
    }
}
