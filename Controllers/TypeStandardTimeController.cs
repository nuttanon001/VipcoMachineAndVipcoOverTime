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
using VipcoMachine.Services.Interfaces;

namespace VipcoMachine.Controllers
{
    [Produces("application/json")]
    [Route("api/TypeStandardTime")]
    public class TypeStandardTimeController : Controller
    {
        #region PrivateMenbers
        private IRepository<TypeStandardTime> repository;
        private IRepository<StandardTime> repositoryStandard;
        private IMapper mapper;

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

        public TypeStandardTimeController(
            IRepository<TypeStandardTime> repo,
            IRepository<StandardTime> repoStandard,
            IMapper map)
        {
            this.repository = repo;
            this.repositoryStandard = repoStandard;
            this.mapper = map;
        }

        #endregion

        #region GET
        // GET: api/TypeStandardTime
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var Includes = new List<string> { "TypeMachine" };

            return new JsonResult(
                  this.ConverterTableToViewModel<TypeStandardTimeViewModel, TypeStandardTime>(await this.repository.GetAllWithInclude2Async(Includes)),
                  this.DefaultJsonSettings);
            // return new JsonResult(await this.repository.GetAllAsync(), this.DefaultJsonSettings);
        }

        // GET: api/TypeStandardTime/5
        [HttpGet("{key}")]
        public async Task<IActionResult> Get(int key)
        {
            string Message = "";
            try
            {
                var Includes = new List<string> { "TypeMachine" };
                return new JsonResult(
                   this.mapper.Map<TypeStandardTime, TypeStandardTimeViewModel>(await this.repository.GetAsynvWithIncludes(key, "TypeStandardTimeId", Includes)),
                   this.DefaultJsonSettings);
                // return new JsonResult(await this.repository.GetAsync(key), this.DefaultJsonSettings);
            }
            catch (Exception ex)
            {
                Message = ex.ToString();
            }

            return NotFound(new { Error = $"Data not found {Message}" });
        }
        // GET: api/TypeStandardTime/GetByMaster/5
        [HttpGet("GetByMaster/{MasterId}")]
        public async Task<IActionResult> GetByMaster(int MasterId)
        {
            var QueryData = this.repository.GetAllAsQueryable()
                                            .Where(x => x.TypeMachineId == MasterId)
                                            .Include(x => x.TypeMachine)
                                            .AsNoTracking();

            return new JsonResult(
                this.ConverterTableToViewModel<TypeStandardTimeViewModel,TypeStandardTime>(await QueryData.ToListAsync())
                , this.DefaultJsonSettings);
        }
        #endregion

        #region POST
        // POST: api/TypeStandardTime/GetScroll
        [HttpPost("GetScroll")]
        public async Task<IActionResult> GetScroll([FromBody] ScrollViewModel Scroll)
        {
            var QueryData = this.repository.GetAllAsQueryable()
                                           .Include(x => x.TypeMachine)
                                           .AsQueryable();
            // Filter
            var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                : Scroll.Filter.ToLower().Split(null);
            foreach (var keyword in filters)
            {
                QueryData = QueryData.Where(x => x.Name.ToLower().Contains(keyword) ||
                                                 x.TypeMachine.TypeMachineCode.ToLower().Contains(keyword) ||
                                                 x.TypeMachine.Name.ToLower().Contains(keyword) ||
                                                 x.StandardTimes
                                                 .Any(z => z.StandardTimeCode.ToLower().Contains(keyword) ||
                                                           z.Description.ToLower().Contains(keyword)));
            }

            // Order
            switch (Scroll.SortField)
            {
                case "TypeMachineString":
                    if (Scroll.SortOrder == -1)
                        QueryData = QueryData.OrderByDescending(s => $"{s.TypeMachine.TypeMachineCode}/{s.TypeMachine.Name}");
                    else
                        QueryData = QueryData.OrderBy(s => $"{s.TypeMachine.TypeMachineCode}/{s.TypeMachine.Name}");
                    break;

                case "Name":
                    if (Scroll.SortOrder == -1)
                        QueryData = QueryData.OrderByDescending(e => e.TypeMachine.Name);
                    else
                        QueryData = QueryData.OrderBy(e => e.TypeMachine.Name);
                    break;

                default:
                    QueryData = QueryData.OrderByDescending(s => $"{s.TypeMachine.TypeMachineCode}/{s.TypeMachine.Name}");
                    break;
            }

            QueryData = QueryData.Skip(Scroll.Skip ?? 0).Take(Scroll.Take ?? 50);

            return new JsonResult(new ScrollDataViewModel<TypeStandardTimeViewModel>
                (Scroll, this.ConverterTableToViewModel<TypeStandardTimeViewModel,TypeStandardTime>(await QueryData.AsNoTracking().ToListAsync()))
                , this.DefaultJsonSettings);
        }

        // POST: api/TypeStandardTime
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]TypeStandardTime nTypeStandardTime)
        {
            if (nTypeStandardTime != null)
            {
                nTypeStandardTime.CreateDate = DateTime.Now;
                nTypeStandardTime.Creator = nTypeStandardTime.Creator ?? "Someone";

                if (nTypeStandardTime.StandardTimes != null)
                {
                    foreach (var nStandard in nTypeStandardTime.StandardTimes)
                    {
                        nStandard.CreateDate = nTypeStandardTime.CreateDate;
                        nStandard.Creator = nTypeStandardTime.Creator;
                    }
                }

                return new JsonResult(await this.repository.AddAsync(nTypeStandardTime), this.DefaultJsonSettings);
            }
            return NotFound(new { Error = "Type Standard Time not found." });
        }
        #endregion

        #region PUT

        // PUT: api/TypeStandardTime/5
        [HttpPut("{key}")]
        public async Task<IActionResult> PutByNumber(int key, [FromBody]TypeStandardTime uTypeStandardTime)
        {
            if (uTypeStandardTime != null)
            {
                uTypeStandardTime.ModifyDate = DateTime.Now;
                uTypeStandardTime.Modifyer = uTypeStandardTime.Modifyer ?? "Someone";

                if (uTypeStandardTime.StandardTimes != null)
                {
                    foreach (var standard in uTypeStandardTime.StandardTimes)
                    {
                        if (standard.StandardTimeId > 0)
                        {
                            standard.ModifyDate = uTypeStandardTime.ModifyDate;
                            standard.Modifyer = uTypeStandardTime.Modifyer;
                        }
                        else
                        {
                            standard.CreateDate = uTypeStandardTime.ModifyDate;
                            standard.Creator = uTypeStandardTime.Modifyer;
                        }
                    }
                }

                // update Master not update Detail it need to update Detail directly
                var updateComplate = await this.repository.UpdateAsync(uTypeStandardTime, key);

                if (updateComplate != null)
                {
                    // filter
                    Expression<Func<StandardTime, bool>> condition = m => m.StandardTimeId == key;
                    var dbStandards = await this.repositoryStandard.FindAllAsync(condition);

                    //Remove Jo if edit remove it
                    foreach (var dbStandard in dbStandards)
                    {
                        if (!uTypeStandardTime.StandardTimes.Any(x => x.StandardTimeId == dbStandard.StandardTimeId))
                            await this.repositoryStandard.DeleteAsync(dbStandard.StandardTimeId);
                    }
                    //Update JobCardDetail or New JobCardDetail
                    foreach (var uStandard in uTypeStandardTime.StandardTimes)
                    {
                        if (uStandard.StandardTimeId > 0)
                            await this.repositoryStandard.UpdateAsync(uStandard, uStandard.StandardTimeId);
                        else
                        {
                            if (uStandard.StandardTimeId < 1)
                                uStandard.TypeStandardTimeId = uTypeStandardTime.TypeStandardTimeId;

                            await this.repositoryStandard.AddAsync(uStandard);
                        }
                    }
                }
                return new JsonResult(updateComplate, this.DefaultJsonSettings);

                //return new JsonResult(await this.repository.UpdateAsync(uTypeStandardTime, key), this.DefaultJsonSettings);
            }
            return NotFound(new { Error = "Type Standard Time not found." });
        }

        #endregion

        #region DELETE

        // DELETE: api/TypeStandardTime/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return new JsonResult(await this.repository.DeleteAsync(id), this.DefaultJsonSettings);
        }

        #endregion
    }
}
