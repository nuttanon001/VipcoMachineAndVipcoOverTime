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
    [Route("api/StandardTime")]
    public class StandardTimeController : Controller
    {
        #region PrivateMenbers

        private IRepository<StandardTime> repository;
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

        public StandardTimeController(IRepository<StandardTime> repo, IMapper map)
        {
            this.repository = repo;
            this.mapper = map;
        }

        #endregion

        #region GET

        // GET: api/StandardTime
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            //return new JsonResult(
            //    this.ConverterTableToViewModel<StandardTimeViewModel,StandardTime>(await this.repository.GetAllAsync()),
            //    this.DefaultJsonSettings);

            var Includes = new List<string> { "TypeStandardTime.TypeMachine", "GradeMaterial" };
            return new JsonResult(
                  this.ConverterTableToViewModel<StandardTimeViewModel, StandardTime>(await this.repository.GetAllWithInclude2Async(Includes)),
                  this.DefaultJsonSettings);
        }

        // GET: api/StandardTime/5
        [HttpGet("{key}")]
        public async Task<IActionResult> Get(int key)
        {
            //return new JsonResult(
            //    this.mapper.Map<StandardTime,StandardTimeViewModel>(await this.repository.GetAsync(key)),
            //    this.DefaultJsonSettings);

            var Includes = new List<string> { "TypeStandardTime.TypeMachine", "GradeMaterial" };
            return new JsonResult(
               this.mapper.Map<StandardTime, StandardTimeViewModel>(await this.repository.GetAsynvWithIncludes(key, "StandardTimeId", Includes)),
               this.DefaultJsonSettings);
        }

        // GET: api/StandardTime/GetByMaster/5
        [HttpGet("GetByMaster/{MasterId}")]
        public async Task<IActionResult> GetByMaster(int MasterId)
        {
            Expression<Func<StandardTime, bool>> Condition = c => c.TypeStandardTimeId == MasterId;

            return new JsonResult(
                this.ConverterTableToViewModel<StandardTimeViewModel,StandardTime>(
                    await this.repository.GetAllWithConditionAndIncludeAsync(Condition, new List<string> { "GradeMaterial","TypeStandardTime" })
                    ),this.DefaultJsonSettings);
        }
        #endregion

        #region POST
        // POST: api/StandardTime/GetTotalStandardTime/5
        [HttpPost("GetTotalStandardTime")]
        public async Task<IActionResult> GetTotalStandardTime([FromBody] PlanViewModel PlanData)
        {
            if (PlanData != null)
            {
                if (PlanData.StandardTimeId != null)
                {
                    // Set StartDate
                    if (PlanData.PlannedStartDate == null)
                        PlanData.PlannedStartDate = DateTime.Today;
                    else // Set Time +7 Hour
                        PlanData.PlannedStartDate = PlanData.PlannedStartDate.Value.AddHours(+7);
                    // Get StandardTime
                    var StdTime = await this.repository.GetAsync(PlanData.StandardTimeId.Value);
                    if (StdTime != null)
                    {
                        // Calc Min to Hour
                        var TotalHour = ((StdTime.PreparationAfter ?? 0) +
                                        (StdTime.PreparationBefor ?? 0) +
                                        (StdTime.StandardTimeValue ?? 0)) / 60;

                        if (TotalHour > 0)
                        {
                            // Round Up
                            double Hour = Math.Ceiling(TotalHour);
                            if (PlanData.Quantity != null)
                            {
                                double Days = Math.Ceiling((Hour * PlanData.Quantity.Value) / 8);
                                PlanData.PlannedEndDate = PlanData.PlannedStartDate.Value.AddDays(Days);
                            }
                            else
                            {
                                double Days = Math.Ceiling(Hour / 8);
                                PlanData.PlannedEndDate = PlanData.PlannedStartDate.Value.AddDays(Days);
                            }
                            // Return
                            return new JsonResult(PlanData, this.DefaultJsonSettings);
                        }
                    }
                }
            }

            return NotFound(new { Error = "Not found standard time id." });
        }

        // POST: api/StandardTime/GetScroll
        [HttpPost("GetScroll")]
        public async Task<IActionResult> GetScroll([FromBody] ScrollViewModel Scroll)
        {
            var QueryData = this.repository.GetAllAsQueryable()
                                           .Include(x => x.TypeStandardTime.TypeMachine)
                                           .Include(x => x.GradeMaterial)
                                           .AsQueryable();
            // Where
            if (!string.IsNullOrEmpty(Scroll.Where))
            {
                if (int.TryParse(Scroll.Where, out int id))
                {
                    QueryData = QueryData.Where(x => x.TypeStandardTime.TypeMachineId == id);
                }
            }

            // Filter
            var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                : Scroll.Filter.ToLower().Split(null);
            foreach (var keyword in filters)
            {
                QueryData = QueryData.Where(x => x.StandardTimeCode.ToLower().Contains(keyword) ||
                                                 x.Description.ToLower().Contains(keyword) ||
                                                 x.TypeStandardTime.Name.ToLower().Contains(keyword) ||
                                                 x.TypeStandardTime.TypeMachine.Name.ToLower().Contains(keyword) ||
                                                 x.GradeMaterial.GradeName.ToLower().Contains(keyword));
            }

            // Order
            switch (Scroll.SortField)
            {
                case "TypeStandardTimeString":
                    if (Scroll.SortOrder == -1)
                        QueryData = QueryData.OrderByDescending(s => $"{s.TypeStandardTime.TypeMachine}/{s.TypeStandardTime.Name}");
                    else
                        QueryData = QueryData.OrderBy(s => $"{s.TypeStandardTime.TypeMachine}/{s.TypeStandardTime.Name}");
                    break;
                case "GradeMaterialString":
                    if (Scroll.SortOrder == -1)
                        QueryData = QueryData.OrderByDescending(s => $"{s.GradeMaterial.GradeName}");
                    else
                        QueryData = QueryData.OrderBy(s => $"{s.GradeMaterial.GradeName}");
                    break;

                case "StandardTimeCode":
                    if (Scroll.SortOrder == -1)
                        QueryData = QueryData.OrderByDescending(e => e.StandardTimeCode);
                    else
                        QueryData = QueryData.OrderBy(e => e.StandardTimeCode);
                    break;

                default:
                    QueryData = QueryData.OrderByDescending(s => s.StandardTimeCode);
                    break;
            }

            QueryData = QueryData.Skip(Scroll.Skip ?? 0).Take(Scroll.Take ?? 50);

            return new JsonResult(new ScrollDataViewModel<StandardTimeViewModel>
                (Scroll, this.ConverterTableToViewModel<StandardTimeViewModel, StandardTime>(await QueryData.AsNoTracking().ToListAsync()))
                , this.DefaultJsonSettings);
        }

        // POST: api/StandardTime
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]StandardTime nStandardTime)
        {
            if (nStandardTime != null)
            {
                nStandardTime.CreateDate = DateTime.Now;
                nStandardTime.Creator = nStandardTime.Creator ?? "Someone";

                return new JsonResult(await this.repository.AddAsync(nStandardTime), this.DefaultJsonSettings);
            }
            return NotFound(new { Error = "Standard Time not found." });
        }
        #endregion

        #region PUT
        // PUT: api/StandardTime/5
        [HttpPut("{key}")]
        public async Task<IActionResult> PutByNumber(int key, [FromBody]StandardTime uStandardTime)
        {
            if (uStandardTime != null)
            {
                uStandardTime.ModifyDate = DateTime.Now;
                uStandardTime.Modifyer = uStandardTime.Modifyer ?? "Someone";

                return new JsonResult(await this.repository.UpdateAsync(uStandardTime, key), this.DefaultJsonSettings);
            }
            return NotFound(new { Error = "Standard Tiem not found." });
        }
        #endregion

        #region DELETE
        // DELETE: api/StandardTime/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return new JsonResult(await this.repository.DeleteAsync(id), this.DefaultJsonSettings);
        }
        #endregion
    }
}
