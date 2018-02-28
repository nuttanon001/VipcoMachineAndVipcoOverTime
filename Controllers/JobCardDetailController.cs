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
using System.Dynamic;

namespace VipcoMachine.Controllers
{
    [Produces("application/json")]
    [Route("api/JobCardDetail")]
    public class JobCardDetailController : Controller
    {
        #region PrivateMenbers
        private IRepository<JobCardDetail> repository;
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

        private IEnumerable<DateTime> EachDay(DateTime from, DateTime thru)
        {
            for (var day = from.Date; day.Date <= thru.Date; day = day.AddDays(1))
                yield return day;
        }
        #endregion PrivateMenbers

        #region Constructor

        public JobCardDetailController(IRepository<JobCardDetail> repo, IMapper map)
        {
            this.repository = repo;
            this.mapper = map;
        }

        #endregion

        #region GET
        // GET: api/JobCardDetail
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var Includes = new List<string> {
                "JobCardMaster.ProjectCodeDetail.ProjectCodeMaster",
                "JobCardMaster.TypeMachine",
                "CuttingPlan",
                "UnitsMeasure",
                "StandardTime.TypeStandardTime",
                "StandardTime.GradeMaterial"
            };

            return new JsonResult(
                  this.ConverterTableToViewModel<JobCardDetailViewModel, JobCardDetail>(await this.repository.GetAllWithInclude2Async(Includes)),
                  this.DefaultJsonSettings);
        }

        // GET: api/JobCardDetail/5
        [HttpGet("{key}")]
        public async Task<IActionResult> Get(int key)
        {
            var Includes = new List<string> {
                "JobCardMaster.ProjectCodeDetail.ProjectCodeMaster",
                "JobCardMaster.TypeMachine",
                "CuttingPlan",
                "UnitsMeasure",
                "StandardTime.TypeStandardTime",
                "StandardTime.GradeMaterial"
            };
            return new JsonResult(
               this.mapper.Map<JobCardDetail, JobCardDetailViewModel>(await this.repository.GetAsynvWithIncludes(key, "JobCardDetailId", Includes)),
               this.DefaultJsonSettings);
        }

        // GET: api/JobCardDetail/GetByKey2/5
        [HttpGet("GetByKey2/{key}")]
        public async Task<IActionResult> GetByKey2(int key)
        {
            var Includes = new List<string> {
                "CuttingPlan",
                "UnitsMeasure",
                "StandardTime.TypeStandardTime",
                "StandardTime.GradeMaterial"
            };
            return new JsonResult(
               this.mapper.Map<JobCardDetail, JobCardDetailViewModel>(await this.repository.GetAsynvWithIncludes(key, "JobCardDetailId", Includes)),
               this.DefaultJsonSettings);
        }

        // GET: api/JobCardDetail/GetByMaster/5
        [HttpGet("GetByMaster/{MasterId}")]
        public async Task<IActionResult> GetByMaster(int MasterId)
        {
            var QueryData = await this.repository.GetAllAsQueryable()
                                                   .Where(x => x.JobCardMasterId == MasterId)
                                                   .Include(x => x.JobCardMaster.ProjectCodeDetail.ProjectCodeMaster)
                                                   .Include(x => x.JobCardMaster.TypeMachine)
                                                   .Include(x => x.CuttingPlan)
                                                   .Include(x => x.UnitsMeasure)
                                                   .Include(x => x.StandardTime.TypeStandardTime)
                                                   .Include(x => x.StandardTime.GradeMaterial)
                                                   .AsNoTracking()
                                                   .ToListAsync();

            //var QueryData = await this.repository.GetAllAsQueryable()
            //                .Where(x => x.JobCardMasterId == MasterId)
            //                .Include(x => x.CuttingPlan)
            //                .Include(x => x.UnitsMeasure)
            //                .Include(x => x.StandardTime.TypeStandardTime)
            //                .Include(x => x.StandardTime.GradeMaterial)
            //                .AsNoTracking()
            //                .ToListAsync();

            return new JsonResult(this.ConverterTableToViewModel<JobCardDetailViewModel, JobCardDetail>(QueryData)
                                , this.DefaultJsonSettings);
        }

        // GET: api/JobCardDetail/GetByMasterV2/5
        [HttpGet("GetByMasterV2/{MasterId}")]
        public async Task<IActionResult> GetByMasterV2(int MasterId)
        {
            var QueryData = await this.repository.GetAllAsQueryable()
                            .Where(x => x.JobCardMasterId == MasterId)
                            .Include(x => x.CuttingPlan)
                            .Include(x => x.UnitsMeasure)
                            .Include(x => x.StandardTime.TypeStandardTime)
                            .Include(x => x.StandardTime.GradeMaterial)
                            .AsNoTracking()
                            .ToListAsync();

            return new JsonResult(this.ConverterTableToViewModel<JobCardDetailViewModel, JobCardDetail>(QueryData)
                                , this.DefaultJsonSettings);
        }

        // GET: api/JobCardDetail/ChangeStandardTime/5/7
        [HttpGet("ChangeStandardTime/{JobCardDetailId}/{StandardTimeId}/{Create}")]
        public async Task<IActionResult> ChangeStandardTime(int JobCardDetailId,int StandardTimeId,string Create)
        {
            var Message = "Not found JobCardDetailId";
            try
            {
                if (JobCardDetailId > 0 && StandardTimeId > 0)
                {
                    var JobDetail = await this.repository.GetAsync(JobCardDetailId);
                    if (JobDetail != null)
                    {
                        if (JobDetail.StandardTimeId != StandardTimeId)
                        {
                            JobDetail.StandardTimeId = StandardTimeId;
                            JobDetail.ModifyDate = DateTime.Now;
                            JobDetail.Modifyer = Create ?? "Someone";

                            return new JsonResult(
                                await this.repository.UpdateAsync(JobDetail, JobDetail.JobCardDetailId),
                                this.DefaultJsonSettings);
                        }
                    }
                }
            }
            catch(Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }

            return NotFound(new { Error = Message });
        }

        #endregion

        #region POST

        // POST: api/JobCardDetail/RequireJobCardDetalSchedule
        [HttpPost("RequireJobCardDetalSchedule")]
        public async Task<IActionResult> RequireJobCardDetalSchedule([FromBody] OptionScheduleViewModel Schedule)
        {
            string Message = "";
            try
            {
                var QueryData = this.repository.GetAllAsQueryable()
                                               .Where(x => x.JobCardDetailStatus != null && 
                                                           x.JobCardDetailStatus == JobCardDetailStatus.Wait &&
                                                           x.JobCardMaster.JobCardMasterStatus != JobCardMasterStatus.Cancel)
                                               .Include(x => x.CuttingPlan)
                                               .Include(x => x.JobCardMaster.ProjectCodeDetail.ProjectCodeMaster)
                                               .AsQueryable();
                int TotalRow;

                if (Schedule != null)
                {
                    if (!string.IsNullOrEmpty(Schedule.Filter))
                    {
                        // Filter
                        var filters = string.IsNullOrEmpty(Schedule.Filter) ? new string[] { "" }
                                            : Schedule.Filter.ToLower().Split(null);
                        foreach (var keyword in filters)
                        {
                            QueryData = QueryData.Where(x => x.CuttingPlan.CuttingPlanNo.ToLower().Contains(keyword) ||
                                                             x.Material.ToLower().Contains(keyword) ||
                                                             x.Remark.ToLower().Contains(keyword) ||
                                                             x.JobCardMaster.ProjectCodeDetail.ProjectCodeMaster.ProjectCode.ToLower().Contains(keyword) ||
                                                             x.JobCardMaster.ProjectCodeDetail.ProjectCodeDetailCode.ToLower().Contains(keyword) ||
                                                             x.JobCardMaster.JobCardMasterNo.ToLower().Contains(keyword));
                        }
                    }

                    // Option ProjectCodeMaster
                    if (Schedule.JobNo.HasValue)
                        QueryData = QueryData.Where(x => x.JobCardMaster.ProjectCodeDetail.ProjectCodeMasterId == Schedule.JobNo);

                    if (Schedule.Level2.HasValue)
                        QueryData = QueryData.Where(x => x.JobCardMaster.ProjectCodeDetailId == Schedule.Level2);

                    // Option Status
                    if (Schedule.TypeMachineId.HasValue)
                        QueryData = QueryData.Where(x => x.JobCardMaster.TypeMachineId == Schedule.TypeMachineId);

                    TotalRow = await QueryData.CountAsync();

                    // Option Skip and Task
                    if (Schedule.Skip.HasValue && Schedule.Take.HasValue)
                        QueryData = QueryData.Skip(Schedule.Skip ?? 0).Take(Schedule.Take ?? 10);
                    else
                        QueryData = QueryData.Skip(0).Take(10);
                }
                else
                    TotalRow = await QueryData.CountAsync();

                var GetData = await QueryData.ToListAsync();
                if (GetData.Any())
                {
                    List<string> Columns = new List<string>();

                    var MinDate = GetData.Min(x => x.CreateDate);
                    var MaxDate = GetData.Max(x => x.CreateDate);

                    if (MinDate == null && MaxDate == null)
                    {
                        return NotFound(new { Error = "Data not found" });
                    }

                    foreach (DateTime day in EachDay(MinDate.Value, MaxDate.Value))
                    {
                        if (GetData.Any(x => x.CreateDate.Value.Date == day.Date))
                            Columns.Add(day.Date.ToString("dd/MM/yy"));
                    }

                    var DataTable = new List<IDictionary<String, Object>>();

                    foreach (var Data in GetData.OrderBy(x => x.CreateDate))
                    {
                        var JobNumber = $"{Data?.JobCardMaster?.ProjectCodeDetail?.ProjectCodeMaster?.ProjectCode ?? "No-Data"}/{(Data?.JobCardMaster?.ProjectCodeDetail == null ? "No-Data" : Data.JobCardMaster.ProjectCodeDetail.ProjectCodeDetailCode)}";

                        IDictionary<String, Object> rowData;
                        bool update = false;
                        if (DataTable.Any(x => (string)x["JobNumber"] == JobNumber))
                        {
                            var FirstData = DataTable.FirstOrDefault(x => (string)x["JobNumber"] == JobNumber);
                            if (FirstData != null)
                            {
                                rowData = FirstData;
                                update = true;
                            }
                            else
                                rowData = new ExpandoObject();
                        }
                        else
                            rowData = new ExpandoObject();

                        if (Data.CreateDate != null)
                        {
                            //Get Employee Name
                            // var Employee = await this.repositoryEmp.GetAsync(Data.RequireEmp);
                            // var EmployeeReq = Employee != null ? $"คุณ{(Employee?.NameThai ?? "")}" : "No-Data";

                            var Key = Data.CreateDate.Value.ToString("dd/MM/yy");
                            // New Data
                            var Master = new JobCardDetailViewModel()
                            {
                                JobCardMasterId = Data.JobCardMasterId,
                                JobCardDetailId = Data.JobCardDetailId,
                                // RequireString = $"{EmployeeReq} | No.{Data.RequireNo}",
                                CuttingPlanString = $"{Data.CuttingPlan.CuttingPlanNo}",
                            };

                            if (rowData.Any(x => x.Key == Key))
                            {
                                // New Value
                                var ListMaster = (List<JobCardDetailViewModel>)rowData[Key];
                                ListMaster.Add(Master);
                                // add to row data
                                rowData[Key] = ListMaster;
                            }
                            else // add new
                                rowData.Add(Key, new List<JobCardDetailViewModel>() { Master });
                        }

                        if (!update)
                        {
                            rowData.Add("JobNumber", JobNumber);
                            DataTable.Add(rowData);
                        }
                    }

                    return new JsonResult(new
                    {
                        TotalRow = TotalRow,
                        Columns = Columns,
                        DataTable = DataTable
                    }, this.DefaultJsonSettings);
                }
            }
            catch (Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }

            return NotFound(new { Error = Message });
        }

        // POST: api/JobCardDetail
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]JobCardDetail nJobCardDetail)
        {
            var Message = "";
            try
            {
                if (nJobCardDetail != null)
                {
                    nJobCardDetail.CreateDate = DateTime.Now;
                    nJobCardDetail.Creator = nJobCardDetail.Creator ?? "Someone";

                    if (nJobCardDetail.CuttingPlan != null)
                    {
                        if (nJobCardDetail.CuttingPlan.CuttingPlanId > 0)
                            nJobCardDetail.CuttingPlan = null;
                        else
                        {
                            nJobCardDetail.CuttingPlan.CreateDate = nJobCardDetail.CreateDate;
                            nJobCardDetail.CuttingPlan.Creator = nJobCardDetail.Creator ?? "Someone";
                            nJobCardDetail.CuttingPlan.ProjectCodeDetail = null;
                        }
                    }

                    if (nJobCardDetail.StandardTime != null)
                        nJobCardDetail.StandardTime = null;

                    if (nJobCardDetail.UnitsMeasure != null)
                    {
                        if (nJobCardDetail.UnitsMeasure.UnitMeasureId > 0)
                            nJobCardDetail.UnitsMeasure = null;
                        else
                        {
                            nJobCardDetail.UnitsMeasure.CreateDate = nJobCardDetail.CreateDate;
                            nJobCardDetail.UnitsMeasure.Creator = nJobCardDetail.Creator ?? "Someone";
                        }
                    }
                        

                    return new JsonResult(await this.repository.AddAsync(nJobCardDetail), this.DefaultJsonSettings);
                }
            }
            catch (Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }


            return NotFound(new { Error = Message });

        }
        #endregion

        #region PUT
        // PUT: api/JobCardDetail/5
        [HttpPut("{key}")]
        public async Task<IActionResult> PutByNumber(int key, [FromBody]JobCardDetail uJobCardDetail)
        {
            uJobCardDetail.ModifyDate = DateTime.Now;
            uJobCardDetail.Modifyer = uJobCardDetail.Modifyer ?? "Someone";

            return new JsonResult(await this.repository.UpdateAsync(uJobCardDetail, key), this.DefaultJsonSettings);
        }
        #endregion

        #region DELETE
        // DELETE: api/JobCardDetail/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return new JsonResult(await this.repository.DeleteAsync(id), this.DefaultJsonSettings);
        }
        #endregion
    }
}
