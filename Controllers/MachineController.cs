using AutoMapper;
using Newtonsoft.Json;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Linq.Expressions;
using System.Collections.Generic;

using VipcoMachine.Models;
using VipcoMachine.ViewModels;
using VipcoMachine.Helpers;
using VipcoMachine.Services.Interfaces;

namespace VipcoMachine.Controllers
{
    [Produces("application/json")]
    [Route("api/Machine")]
    public class MachineController : Controller
    {
        #region PrivateMenbers
        private IRepository<Machine> repository;
        private IRepository<MachineHasOperator> repositoryOp;
        private IMapper mapper;
        private HelpersClass<Machine> helpers;

        private JsonSerializerSettings DefaultJsonSettings =>
            new JsonSerializerSettings()
            {
                Formatting = Formatting.Indented,
                PreserveReferencesHandling = PreserveReferencesHandling.Objects,
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            };
        private List<MapType> ConverterTableToViewModel<MapType, TableType>(ICollection<TableType> tables)
        {
            var listData = new List<MapType>();
            foreach (var item in tables)
                listData.Add(this.mapper.Map<TableType, MapType>(item));
            return listData;
        }
        #endregion PrivateMenbers

        #region Constructor

        public MachineController(IRepository<Machine> repo,IRepository<MachineHasOperator> repoOp, IMapper map)
        {
            this.repository = repo;
            this.repositoryOp = repoOp;
            this.mapper = map;

            this.helpers = new HelpersClass<Machine>();
        }

        #endregion

        #region GET

        // GET: api/Machine/
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            // return new JsonResult(await this.repository.GetAllAsync(), this.DefaultJsonSettings);
            var Includes = new List<string> { "TypeMachine"};
            return new JsonResult(
                  this.ConverterTableToViewModel<MachineViewModel, Machine>(await this.repository.GetAllWithInclude2Async(Includes)),
                  this.DefaultJsonSettings);
        }

        // GET: api/Machine/5
        [HttpGet("{key}")]
        public async Task<IActionResult> Get(int key)
        {
            //return new JsonResult(this.mapper.Map<Machine,MachineViewModel>(await this.repository.GetAsync(key)), this.DefaultJsonSettings);
            var Includes = new List<string> { "TypeMachine" };
            return new JsonResult(
               this.mapper.Map<Machine, MachineViewModel>(await this.repository.GetAsynvWithIncludes(key, "MachineId", Includes)),
               this.DefaultJsonSettings);
        }
        // GET: api/Machine/GetByMaster/5
        [HttpGet("GetByMaster/{MasterId}")]
        public async Task<IActionResult> GetByMaster(int MasterId)
        {
            var QueryData = this.repository.GetAllAsQueryable()
                                .Where(x => x.TypeMachineId == MasterId)
                                .Include(x => x.TypeMachine);
            return new JsonResult(
                this.ConverterTableToViewModel<MachineViewModel, Machine>(await QueryData.AsNoTracking().ToListAsync()),
                this.DefaultJsonSettings);
        }
        #endregion

        #region POST

        // POST: api/Machine/GetScroll
        [HttpPost("GetScroll")]
        public async Task<IActionResult> GetScroll([FromBody] ScrollViewModel Scroll)
        {
            var QueryData = this.repository.GetAllAsQueryable()
                                           .Include(x => x.TypeMachine)
                                           .AsQueryable();
            // Filter Have Condition
            // Filter: [filter1]#Condition[id]
            if (!string.IsNullOrEmpty(Scroll.Filter))
            {
                if (Scroll.Filter.IndexOf("Condition") > -1)
                {
                    var Split = Scroll.Filter.Split('#');
                    Scroll.Filter = Split[0];
                    if (!string.IsNullOrEmpty(Split[1]))
                    {
                        if (int.TryParse(Split[1].Replace("Condition", ""), out int id))
                        {
                            QueryData = QueryData.Where(x => x.TypeMachineId == id);
                        }
                    }
                }
            }
            // Filter
            var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                               : Scroll.Filter.ToLower().Split(null);

            foreach (var keyword in filters)
            {
                QueryData = QueryData.Where(x => x.MachineCode.ToLower().Contains(keyword) ||
                                                 x.MachineName.ToLower().Contains(keyword) ||
                                                 x.TypeMachine.TypeMachineCode.ToLower().Contains(keyword));
            }

            // Order
            switch (Scroll.SortField)
            {
                case "MachineCode":
                    if (Scroll.SortOrder == -1)
                        QueryData = QueryData.OrderByDescending(e => e.MachineCode);
                    else
                        QueryData = QueryData.OrderBy(e => e.MachineCode);
                    break;
                case "MachineName":
                    if (Scroll.SortOrder == -1)
                        QueryData = QueryData.OrderByDescending(e => e.MachineName);
                    else
                        QueryData = QueryData.OrderBy(e => e.MachineName);
                    break;
                case "TypeMachineString":
                    if (Scroll.SortOrder == -1)
                        QueryData = QueryData.OrderByDescending(e => e.TypeMachine.TypeMachineCode);
                    else
                        QueryData = QueryData.OrderBy(e => e.TypeMachine.TypeMachineCode);
                    break;
                default:
                    QueryData = QueryData.OrderByDescending(e => e.TypeMachine.TypeMachineCode);
                    break;
            }
            // Skip and Take
            QueryData = QueryData.Skip(Scroll.Skip ?? 0).Take(Scroll.Take ?? 50);

            return new JsonResult(new ScrollDataViewModel<MachineViewModel>
                (Scroll,this.ConverterTableToViewModel<MachineViewModel,Machine>
                            (await QueryData.AsNoTracking().ToListAsync())),
                                this.DefaultJsonSettings);
        }

        // POST: api/Machine
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]MachineViewModel nMachineViewModel)
        {
            if (nMachineViewModel != null)
            {
                var nMachine = this.mapper.Map<MachineViewModel, Machine>(nMachineViewModel);

                nMachine = this.helpers.AddHourMethod(nMachine);

                nMachine.CreateDate = DateTime.Now;
                nMachine.Creator = nMachine.Creator ?? "Someone";

                if (nMachine.MachineHasOperators != null)
                {
                    foreach (var nOp in nMachine.MachineHasOperators)
                    {
                        nOp.CreateDate = nMachine.CreateDate;
                        nOp.Creator = nMachine.Creator;
                    }
                }

                return new JsonResult(await this.repository.AddAsync(nMachine), this.DefaultJsonSettings);
            }

            return NotFound(new { Error = "Machine data not found." });
        }

        #endregion

        #region PUT
        // PUT: api/Machine/5
        [HttpPut("{key}")]
        public async Task<IActionResult> PutByNumber(int key, [FromBody]MachineViewModel uMachineViewModel)
        {
            if (uMachineViewModel != null)
            {
                var uMachine = this.mapper.Map<MachineViewModel, Machine>(uMachineViewModel);
                uMachine = this.helpers.AddHourMethod(uMachine);

                uMachine.ModifyDate = DateTime.Now;
                uMachine.Modifyer = uMachine.Modifyer ?? "Someone";

                if (uMachine.MachineHasOperators != null)
                {
                    foreach (var detail in uMachine.MachineHasOperators)
                    {
                        if (detail.MachineOperatorId > 0)
                        {
                            detail.ModifyDate = uMachine.ModifyDate;
                            detail.Modifyer = uMachine.Modifyer;
                        }
                        else
                        {
                            detail.CreateDate = uMachine.ModifyDate;
                            detail.Creator = uMachine.Modifyer;
                        }
                    }
                }
                // update Master not update Detail it need to update Detail directly
                var updateComplate = await this.repository.UpdateAsync(uMachine, key);

                if (updateComplate != null)
                {
                    // filter
                    Expression<Func<MachineHasOperator, bool>> condition = m => m.MachineId == key;
                    var dbOps = this.repositoryOp.FindAll(condition);

                    //Remove ProjectCodeDetails if edit remove it
                    foreach (var dbOp in dbOps)
                    {
                        if (!uMachine.MachineHasOperators.Any(x => x.EmpCode == dbOp.EmpCode))
                            await this.repositoryOp.DeleteAsync(dbOp.MachineOperatorId);
                    }
                    ////Update ProjectCodeDetails
                    foreach (var uOp in uMachine.MachineHasOperators)
                    {
                        if (uOp.MachineOperatorId > 0)
                            await this.repositoryOp.UpdateAsync(uOp, uOp.MachineOperatorId);
                        else
                        {
                            if (uOp.MachineId < 1)
                                uOp.MachineId = uMachine.MachineId;

                            await this.repositoryOp.AddAsync(uOp);
                        }
                    }
                }

                return new JsonResult(updateComplate, this.DefaultJsonSettings);
            }

            return NotFound(new { Error = "Machine data not found" });

        }
        #endregion

        #region DELETE
        // DELETE: api/Machine/5
        [HttpDelete("{key}")]
        public async Task<IActionResult> Delete(int key)
        {
            return new JsonResult(await this.repository.DeleteAsync(key), this.DefaultJsonSettings);
        }
        #endregion
    }
}
