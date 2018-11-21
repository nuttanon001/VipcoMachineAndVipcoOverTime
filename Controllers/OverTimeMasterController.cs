using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.NodeServices;

using System;
using System.Linq;
using System.Dynamic;
using System.Net.Http;
using System.Threading.Tasks;
using System.Linq.Expressions;
using System.Collections.Generic;

using VipcoMachine.Helpers;
using VipcoMachine.Models;
using VipcoMachine.ViewModels;
using VipcoMachine.Services.Interfaces;

using Newtonsoft.Json;

namespace VipcoMachine.Controllers
{
    [Produces("application/json")]
    [Route("api/OverTimeMaster")]
    public class OverTimeMasterController : Controller
    {
        #region PrivateMembers
        private readonly IRepository<OverTimeMaster> repository;
        private readonly IRepository<OverTimeDetail> repositoryOverTimeDetail;
        private readonly IRepository<ProjectCodeMaster> repositoryProjectMaster;
        private readonly IRepository<EmployeeGroup> repositoryEmpGroup;
        private readonly IRepository<Employee> repositoryEmployee;
        private readonly IRepository<HolidayOverTime> repositoryHoliday;
        private readonly IRepository<WorkShop> repositoryWorkShop;
        private readonly IRepository<WorkGroupHasWorkShop> repositoryWorkGroupHasShop;
        private readonly IMapper mapper;
        private readonly IHostingEnvironment hostingEnvironment;
        private HelpersClass<OverTimeMaster> helpers;

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
        public OverTimeMasterController(
                IRepository<OverTimeMaster> repo,
                IRepository<OverTimeDetail> repoOverTimeDetail,
                IRepository<ProjectCodeMaster> repoProjectMaster,
                IRepository<EmployeeGroup> repoEmpGroup,
                IRepository<Employee> repoEmp,
                IRepository<HolidayOverTime> repoHoli,
                IRepository<WorkShop> repoWorkShop,
                IRepository<WorkGroupHasWorkShop> repoWorkGroupHasShop,
                IHostingEnvironment hosting,
                IMapper map)
        {
            //Repository
            this.repository = repo;
            this.repositoryHoliday = repoHoli;
            this.repositoryOverTimeDetail = repoOverTimeDetail;
            this.repositoryProjectMaster = repoProjectMaster;
            this.repositoryEmpGroup = repoEmpGroup;
            this.repositoryEmployee = repoEmp;
            this.repositoryWorkShop = repoWorkShop;
            this.repositoryWorkGroupHasShop = repoWorkGroupHasShop;
            // Other
            this.hostingEnvironment = hosting;
            this.mapper = map;
            this.helpers = new HelpersClass<OverTimeMaster>();
        }

        #endregion

        #region GET

        // GET: api/OverTimeMaster/
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var Includes = new List<string> { "EmployeeGroup","EmployeeGroupMIS", "ProjectCodeMaster", "ApproveBy", "RequireBy" };
            return new JsonResult(
                      this.ConverterTableToViewModel<OverTimeMasterViewModel, OverTimeMaster>
                      (await this.repository.GetAllWithInclude2Async(Includes)),
                      this.DefaultJsonSettings);
        }

        // GET: api/OverTimeMaster/5
        [HttpGet("{key}")]
        public async Task<IActionResult> Get(int key)
        {
            var Includes = new List<string> { "EmployeeGroup","EmployeeGroupMIS", "ProjectCodeMaster", "ApproveBy", "RequireBy" };
            return new JsonResult(
                      this.mapper.Map<OverTimeMaster, OverTimeMasterViewModel>
                      (await this.repository.GetAsynvWithIncludes(key, "OverTimeMasterId", Includes)),
                      this.DefaultJsonSettings);
        }

        // GET: api/OverTimeMaster/GetLastOverTime
        [HttpGet("GetLastOverTime/{ProjectCodeId}/{GroupCode}/{CurrentId}")]
        public async Task<IActionResult> GetLastOverTime(int ProjectCodeId,string GroupCode,int CurrentId)
        {
            if (ProjectCodeId > 0 && !string.IsNullOrEmpty(GroupCode))
            {
                var QueryData = this.repository.GetAllAsQueryable()
                                                .Where(x => x.OverTimeStatus != OverTimeStatus.Cancel)
                                                .OrderByDescending(x => x.OverTimeDate)
                                                .Include(x => x.ApproveBy)
                                                .Include(x => x.RequireBy)
                                                .Include(x => x.ProjectCodeMaster)
                                                .Include(x => x.EmployeeGroupMIS)
                                                .Include(x => x.EmployeeGroup).AsQueryable();

                if (CurrentId > 0)
                    QueryData = QueryData.Where(x => x.OverTimeMasterId != CurrentId);

                var LastOverTime = await QueryData.FirstOrDefaultAsync(x => x.ProjectCodeMasterId == ProjectCodeId && x.GroupCode == GroupCode);

                if (LastOverTime != null)
                {
                    if (LastOverTime.OverTimeStatus != OverTimeStatus.Cancel)
                        return new JsonResult(this.mapper.Map<OverTimeMaster, OverTimeMasterViewModel>(LastOverTime), this.DefaultJsonSettings);
                    else
                        return Ok();
                }
            }

            return NotFound(new { Error = "Not found ProjectCodeMasterId ,GroupCode or LastOverTime." });
        }

        // GET: api/OverTimeMaster/ChangeStatus
        [HttpGet("ChangeStatus/{key}")]
        public async Task<IActionResult> GetChangeOverTimeStatus(int key)
        {
            if (key > 0)
            {
                var OverTimeMasterP = await this.repository.GetAsync(key);
                if (OverTimeMasterP != null)
                {
                    OverTimeMasterP.OverTimeStatus = OverTimeStatus.Required;
                    return new JsonResult(await this.repository.UpdateAsync(OverTimeMasterP, key), this.DefaultJsonSettings);
                }
            }
            return NotFound(new { Error = "Not found overtime." });
        }

        #endregion

        #region POST

        // POST: api/OverTimeMaster/GetLastOverTimeV2
        [HttpPost("GetLastOverTimeV2/")]
        public async Task<IActionResult> GetLastOverTimeV2([FromBody]OptionLastOverTimeViewModel OptionLastOver)
        {
            if (OptionLastOver.ProjectCodeId.HasValue && !string.IsNullOrEmpty(OptionLastOver.GroupCode))
            {
                var QueryData = this.repository.GetAllAsQueryable()
                                                .Where(x => x.OverTimeStatus != OverTimeStatus.Cancel)
                                                .OrderByDescending(x => x.OverTimeDate)
                                                .Include(x => x.ApproveBy)
                                                .Include(x => x.RequireBy)
                                                .Include(x => x.ProjectCodeMaster)
                                                .Include(x => x.EmployeeGroupMIS)
                                                .Include(x => x.EmployeeGroup).AsQueryable();

                if (OptionLastOver.CurrentOverTimeId.HasValue)
                {
                    if (OptionLastOver.CurrentOverTimeId.Value > 0)
                        QueryData = QueryData.Where(x => x.OverTimeMasterId != OptionLastOver.CurrentOverTimeId);
                }

                if (OptionLastOver.BeForDate.HasValue)
                {
                    OptionLastOver.BeForDate = OptionLastOver.BeForDate.Value.AddHours(7);
                    QueryData = QueryData.Where(x => x.OverTimeDate.Date <= OptionLastOver.BeForDate.Value.Date);
                }

                if (!string.IsNullOrEmpty(OptionLastOver.GroupMis))
                {
                    QueryData = QueryData.Where(x => x.GroupMIS == OptionLastOver.GroupMis);
                }

                var LastOverTime = await QueryData.FirstOrDefaultAsync(x => x.ProjectCodeMasterId == OptionLastOver.ProjectCodeId &&
                                                                            x.GroupCode == OptionLastOver.GroupCode);

                if (LastOverTime != null)
                {
                    return new JsonResult(this.mapper.Map<OverTimeMaster, OverTimeMasterViewModel>(LastOverTime), this.DefaultJsonSettings);
                }
            }

            return NotFound(new { Error = "Not found ProjectCodeMasterId ,GroupCode or LastOverTime." });
        }

        // POST: api/OverTimeMaster/GetLastOverTimeV3
        [HttpPost("GetLastOverTimeV3/")]
        public async Task<IActionResult> GetLastOverTimeV3([FromBody]OptionLastOverTimeViewModel OptionLastOver)
        {
            var Message = "Data not been found.";

            try
            {
                if (OptionLastOver.ProjectCodeId.HasValue && !string.IsNullOrEmpty(OptionLastOver.GroupMis))
                {
                    var QueryData = this.repository.GetAllAsQueryable()
                                                    .Where(x => x.OverTimeStatus != OverTimeStatus.Cancel)
                                                    .OrderByDescending(x => x.OverTimeDate)
                                                    .Include(x => x.ApproveBy)
                                                    .Include(x => x.RequireBy)
                                                    .Include(x => x.ProjectCodeMaster)
                                                    .Include(x => x.OverTimeDetails)
                                                    .Include(x => x.EmployeeGroupMIS).AsQueryable();
                    if (OptionLastOver.CurrentOverTimeId.HasValue)
                    {
                        if (OptionLastOver.CurrentOverTimeId.Value > 0)
                            QueryData = QueryData.Where(x => x.OverTimeMasterId != OptionLastOver.CurrentOverTimeId);
                    }
                    if (OptionLastOver.BeForDate.HasValue)
                    {
                        OptionLastOver.BeForDate = OptionLastOver.BeForDate.Value.AddHours(7);
                        QueryData = QueryData.Where(x => x.OverTimeDate.Date <= OptionLastOver.BeForDate.Value.Date);
                    }

                    var LastOverTime = await QueryData.FirstOrDefaultAsync(x => x.ProjectCodeMasterId == OptionLastOver.ProjectCodeId &&
                                                                                x.GroupMIS == OptionLastOver.GroupMis &&
                                                                                x.LocationCode == OptionLastOver.LocationCode);

                    if (LastOverTime != null)
                    {
                        if (LastOverTime.OverTimeDetails.Any(z => z.StartOverTime.HasValue && z.StartOverTime.Value != 17))
                        {
                            LastOverTime.OverTimeStatus = OverTimeStatus.Complate;
                            return new JsonResult(this.mapper.Map<OverTimeMaster, OverTimeMasterViewModel>(LastOverTime), this.DefaultJsonSettings);
                        }
                        // if has date overtime
                        if (OptionLastOver.BeForDate.HasValue)
                        {
                            var Holiday = await this.repositoryHoliday
                                .GetAllWithConditionAndIncludeAsync(h => h.HolidayStatus != HolidayStatus.Cancel &&
                                                                         h.HolidayDate != null);

                            if (Holiday.Any(x => x.HolidayDate.Value.Date == OptionLastOver.BeForDate.Value.Date))
                            {
                                var Date1 = OptionLastOver.BeForDate.Value.AddDays(-1).Date;
                                if (Date1 == LastOverTime.OverTimeDate.Date)
                                {
                                    LastOverTime.OverTimeStatus = OverTimeStatus.Complate;
                                    return new JsonResult
                                        (this.mapper.Map<OverTimeMaster, OverTimeMasterViewModel>(LastOverTime),
                                         this.DefaultJsonSettings);
                                }
                            }
                            else
                            {
                                if (OptionLastOver.BeForDate.Value.DayOfWeek == DayOfWeek.Sunday)
                                {
                                    var Date1 = OptionLastOver.BeForDate.Value.AddDays(-1).Date;
                                    if (Date1 == LastOverTime.OverTimeDate.Date)
                                    {
                                        if (LastOverTime.OverTimeDate.DayOfWeek == DayOfWeek.Saturday)
                                        {
                                            LastOverTime.OverTimeStatus = OverTimeStatus.Complate;
                                            return new JsonResult(this.mapper.Map<OverTimeMaster, OverTimeMasterViewModel>(LastOverTime), this.DefaultJsonSettings);
                                        }
                                    }
                                }
                            }
                            #region Don't user
                            // if has date overtime sunday
                            // if (OptionLastOver.BeForDate.Value.DayOfWeek == DayOfWeek.Sunday)
                            // {
                            //    var Date1 = OptionLastOver.BeForDate.Value.AddDays(-1).Date;
                            //    if (Date1 == LastOverTime.OverTimeDate.Date)
                            //    {
                            //        if (LastOverTime.OverTimeDate.DayOfWeek == DayOfWeek.Saturday)
                            //        {
                            //            LastOverTime.OverTimeStatus = OverTimeStatus.Complate;
                            //            return new JsonResult(this.mapper.Map<OverTimeMaster, OverTimeMasterViewModel>(LastOverTime), this.DefaultJsonSettings);
                            //        }
                            //    }
                            // }
                            #endregion
                        }
                        return new JsonResult(this.mapper.Map<OverTimeMaster, OverTimeMasterViewModel>(LastOverTime), this.DefaultJsonSettings);
                    }
                }
            }
            catch(Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }
           
            return BadRequest(new { Message });
        }

        // POST: api/OverTimeMaster/OverTimeSchedule
        [HttpPost("OverTimeSchedule")]
        public async Task<IActionResult> OverTimeSchedule([FromBody] OptionOverTimeSchedule Scehdule)
        {
            string Message = "";
            try
            {
                var QueryData = this.repository.GetAllAsQueryable()
                                                .Include(x => x.ApproveBy)
                                                .Include(x => x.RequireBy)
                                                .Include(x => x.ProjectCodeMaster)
                                                .Include(x => x.EmployeeGroup)
                                                .Include(x => x.EmployeeGroupMIS)
                                                .AsQueryable();
                int TotalRow;

                if (Scehdule != null)
                {
                    if (!string.IsNullOrEmpty(Scehdule.Filter))
                    {
                        // Filter
                        var filters = string.IsNullOrEmpty(Scehdule.Filter) ? new string[] { "" }
                                            : Scehdule.Filter.ToLower().Split(null);
                        foreach (var keyword in filters)
                        {
                            QueryData = QueryData.Where(x => x.EmpRequire.ToLower().Contains(keyword) ||
                                                             x.RequireBy.NameThai.ToLower().Contains(keyword) ||
                                                             x.ProjectCodeMaster.ProjectCode.ToLower().Contains(keyword) ||
                                                             x.ProjectCodeMaster.ProjectName.ToLower().Contains(keyword) ||
                                                             x.EmployeeGroupMIS.GroupDesc.ToLower().Contains(keyword) ||
                                                             x.EmployeeGroup.Description.ToLower().Contains(keyword));
                        }
                    }

                    // Option ProjectCodeMaster
                    if (Scehdule.ProjectMasterId.HasValue)
                    {
                        QueryData = QueryData.Where(x => x.ProjectCodeMasterId == Scehdule.ProjectMasterId);
                    }
                    // Option GroupCode
                    if (!string.IsNullOrEmpty(Scehdule.GroupCode))
                    {
                        QueryData = QueryData.Where(x => x.GroupCode == Scehdule.GroupCode);
                    }
                    // Option SDate
                    if (Scehdule.SDate.HasValue)
                    {
                    }

                    // Option EDate
                    if (Scehdule.EDate.HasValue)
                    {
                    }

                    // Option Create
                    if (!string.IsNullOrEmpty(Scehdule.Create))
                    {
                        QueryData = QueryData.Where(x => x.Creator == Scehdule.Create);
                    }

                    // Option Status
                    if (Scehdule.Status.HasValue)
                    {
                        if (Scehdule.Status == 1)
                            QueryData = QueryData.Where(x => x.OverTimeStatus == OverTimeStatus.Required);
                        else if (Scehdule.Status == 2)
                            QueryData = QueryData.Where(x => x.OverTimeStatus == OverTimeStatus.WaitActual);
                        else
                            QueryData = QueryData.Where(x => x.OverTimeStatus != OverTimeStatus.Cancel);
                    }
                    else
                    {
                        QueryData = QueryData.Where(x => x.OverTimeStatus == OverTimeStatus.Required);
                    }

                    TotalRow = await QueryData.CountAsync();

                    // Option Skip and Task
                    if (Scehdule.Skip.HasValue && Scehdule.Take.HasValue)
                        QueryData = QueryData.Skip(Scehdule.Skip ?? 0).Take(Scehdule.Take ?? 4);
                    else
                        QueryData = QueryData.Skip(0).Take(10);
                }
                else
                {
                    TotalRow = await QueryData.CountAsync();
                }

                var GetData = await QueryData.ToListAsync();
                if (GetData.Any())
                {
                    List<string> Columns = new List<string>();

                    var MinDate = GetData.Min(x => x.OverTimeDate);
                    var MaxDate = GetData.Max(x => x.OverTimeDate);

                    if (MinDate == null && MaxDate == null)
                    {
                        return NotFound(new { Error = "Data not found" });
                    }

                    foreach (DateTime day in EachDay(MinDate, MaxDate))
                    {
                        if (GetData.Any(x => x.OverTimeDate.Date == day.Date))
                            Columns.Add(day.Date.ToString("dd/MM/yy"));
                    }

                    var DataTable = new List<IDictionary<String, Object>>();

                    foreach (var Data in GetData.OrderBy(x => x.ProjectCodeMaster.ProjectCode).ThenBy(x => x.EmployeeGroupMIS?.GroupDesc))
                    {
                        var JobNumber = $"{Data?.ProjectCodeMaster?.ProjectCode}/{Data?.ProjectCodeMaster.ProjectName}";
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

                        // Data is 1:Plan,2:Actual,3:PlanAndActual
                        // For Plan
                        if (Data.OverTimeDate != null)
                        {
                            //var key = columnNames.Where(y => y.Contains(dateString)).FirstOrDefault();
                            //if (((IDictionary<String, Object>)data).Keys.Any(x => x == key))
                            //    ((IDictionary<String, Object>)data)[key] += $"#{item.TransportId}";
                            //else
                            //    ((IDictionary<String, Object>)data).Add(key, $"{item.TransportId}");
                            var Key = Data.OverTimeDate.ToString("dd/MM/yy");
                            if (rowData.Any(x => x.Key == Key))
                            {
                                var ListMaster = (List<OverTimeMaster>)rowData[Key];
                                ListMaster.Add(new OverTimeMaster
                                {
                                    OverTimeMasterId = Data.OverTimeMasterId,
                                    GroupCode = Data?.EmployeeGroupMIS?.GroupDesc ?? "-",
                                });

                                rowData[Key] = ListMaster;
                            }
                            else // add new
                            {
                                var Master = new OverTimeMaster()
                                {
                                    OverTimeMasterId = Data.OverTimeMasterId,
                                    GroupCode = Data?.EmployeeGroupMIS?.GroupDesc ?? "-",
                                };
                                rowData.Add(Key, new List<OverTimeMaster>() {Master});
                            }
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

        // POST: api/OverTimeMaster/GetScroll
        [HttpPost("GetScroll")]
        public async Task<IActionResult> GetScroll([FromBody] ScrollViewModel Scroll)
        {
            var Message = "";
            try
            {
                var QueryData = this.repository.GetAllAsQueryable()
                                    .Include(x => x.ApproveBy)
                                    .Include(x => x.RequireBy)
                                    .Include(x => x.ProjectCodeMaster)
                                    .Include(x => x.EmployeeGroup)
                                    .Include(x => x.EmployeeGroupMIS)
                                    .Where(x => x.OverTimeStatus != OverTimeStatus.Cancel)
                                    .AsNoTracking()
                                    .AsQueryable();
                // Where
                if (!string.IsNullOrEmpty(Scroll.Where))
                {
                    QueryData = QueryData.Where(x => x.Creator == Scroll.Where);
                }

                // Filter
                var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                    : Scroll.Filter.ToLower().Split(null);
                foreach (var keyword in filters)
                {
                    QueryData = QueryData.Where(x => x.EmpRequire.ToLower().Contains(keyword) ||
                                                     x.RequireBy.NameThai.ToLower().Contains(keyword) ||
                                                     x.ProjectCodeMaster.ProjectCode.ToLower().Contains(keyword) ||
                                                     x.ProjectCodeMaster.ProjectName.ToLower().Contains(keyword) ||
                                                     x.EmployeeGroupMIS.GroupDesc.ToLower().Contains(keyword));
                }

                // Order
                switch (Scroll.SortField)
                {
                    case "RequireString":
                        if (Scroll.SortOrder == -1)
                            QueryData = QueryData.OrderByDescending(e => e.RequireBy.NameThai);
                        else
                            QueryData = QueryData.OrderBy(e => e.RequireBy.NameThai);
                        break;

                    case "ProjectMasterString":
                        if (Scroll.SortOrder == -1)
                            QueryData = QueryData.OrderByDescending(e => e.ProjectCodeMaster.ProjectCode);
                        else
                            QueryData = QueryData.OrderBy(e => e.ProjectCodeMaster.ProjectCode);
                        break;
                    case "GroupMisString":
                        if (Scroll.SortOrder == -1)
                            QueryData = QueryData.OrderByDescending(e => e.EmployeeGroupMIS.GroupDesc);
                        else
                            QueryData = QueryData.OrderBy(e => e.EmployeeGroupMIS.GroupDesc);
                        break;

                    case "OverTimeDate":
                        if (Scroll.SortOrder == -1)
                            QueryData = QueryData.OrderByDescending(e => e.OverTimeDate);
                        else
                            QueryData = QueryData.OrderBy(e => e.OverTimeDate);
                        break;

                    default:
                        QueryData = QueryData.OrderByDescending(e => e.OverTimeDate);
                        break;
                }

                QueryData = QueryData.Skip(Scroll.Skip ?? 0).Take(Scroll.Take ?? 50);

                return new JsonResult(new ScrollDataViewModel<OverTimeMaster>
                        (Scroll,
                        this.ConverterTableToViewModel<OverTimeMasterViewModel, OverTimeMaster>(await QueryData.AsNoTracking().ToListAsync())),
                        this.DefaultJsonSettings);
            }
            catch (Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }
            return NotFound(new { Error = Message });
        }

        // POST: api/OverTimeMaster
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]OverTimeMaster nOverTimeMaster)
        {
            var Message = "Not found OverTimeMaster.";

            if (nOverTimeMaster != null)
            {
                // add hour to DateTime to set Asia/Bangkok
                nOverTimeMaster = helpers.AddHourMethod(nOverTimeMaster);

                nOverTimeMaster.CreateDate = DateTime.Now;
                nOverTimeMaster.Creator = nOverTimeMaster.Creator ?? "Someone";

                if (nOverTimeMaster.ProjectCodeMaster != null)
                    nOverTimeMaster.ProjectCodeMaster = null;

                if (nOverTimeMaster.EmployeeGroup != null)
                    nOverTimeMaster.EmployeeGroup = null;

                if (nOverTimeMaster.EmployeeGroupMIS != null)
                    nOverTimeMaster.EmployeeGroupMIS = null;

                if (nOverTimeMaster.ApproveBy != null)
                    nOverTimeMaster.ApproveBy = null;

                if (nOverTimeMaster.RequireBy != null)
                    nOverTimeMaster.RequireBy = null;

                List<OverTimeDetail> remove = new List<OverTimeDetail>();
                if (nOverTimeMaster.OverTimeDetails != null)
                {
                    foreach (var nDetail in nOverTimeMaster.OverTimeDetails)
                    {
                        Expression<Func<OverTimeDetail, bool>> condition = d =>
                             d.OverTimeMaster.OverTimeStatus != OverTimeStatus.Cancel &&
                             d.OverTimeMaster.OverTimeDate.Date == nOverTimeMaster.OverTimeDate.Date &&
                             d.EmpCode == nDetail.EmpCode && d.OverTimeDetailStatus == OverTimeDetailStatus.Use;
                        // check if employee on auther overtime continue him
                        if (await this.repositoryOverTimeDetail.AnyDataAsync(condition))
                        {
                            remove.Add(nDetail);
                            continue;
                        }

                        if (nDetail.OverTimeDetailStatus == null)
                            nDetail.OverTimeDetailStatus = OverTimeDetailStatus.Use;
                        if (nDetail.Employee != null)
                            nDetail.Employee = null;
                        //Set Create
                        nDetail.CreateDate = nOverTimeMaster.CreateDate;
                        nDetail.Creator = nOverTimeMaster.Creator;
                    }
                }

                if (remove.Any())
                {
                    remove.ForEach(item =>
                    {
                        nOverTimeMaster.OverTimeDetails.Remove(item);
                    });
                }

                if (nOverTimeMaster.OverTimeDetails.Any())
                {
                    return new JsonResult(await this.repository.AddAsync(nOverTimeMaster), this.DefaultJsonSettings);
                }

                Message = "Employees for OverTime don't have.";
            }

            return NotFound(new { Error = Message });
        }

        // POST: api/OverTimeMaster
        [HttpPost("V2")]
        public async Task<IActionResult> PostV2([FromBody]OverTimeMaster nOverTimeMaster)
        {
            var Message = "Not found OverTimeMaster.";

            if (nOverTimeMaster != null)
            {
                // add hour to DateTime to set Asia/Bangkok
                nOverTimeMaster = helpers.AddHourMethod(nOverTimeMaster);

                nOverTimeMaster.CreateDate = DateTime.Now;
                nOverTimeMaster.Creator = nOverTimeMaster.Creator ?? "Someone";

                if (nOverTimeMaster.ProjectCodeMaster != null)
                    nOverTimeMaster.ProjectCodeMaster = null;

                if (nOverTimeMaster.EmployeeGroup != null)
                    nOverTimeMaster.EmployeeGroup = null;

                if (nOverTimeMaster.EmployeeGroupMIS != null)
                    nOverTimeMaster.EmployeeGroupMIS = null;

                if (nOverTimeMaster.ApproveBy != null)
                    nOverTimeMaster.ApproveBy = null;

                if (nOverTimeMaster.RequireBy != null)
                    nOverTimeMaster.RequireBy = null;

                List<OverTimeDetail> remove = new List<OverTimeDetail>();
                List<string> emps = new List<string>();
                if (nOverTimeMaster.OverTimeDetails != null)
                {
                    foreach (var nDetail in nOverTimeMaster.OverTimeDetails)
                    {
                        Expression<Func<OverTimeDetail, bool>> condition = d =>
                             d.OverTimeMaster.OverTimeStatus != OverTimeStatus.Cancel &&
                             d.OverTimeMaster.OverTimeDate.Date == nOverTimeMaster.OverTimeDate.Date &&
                             d.StartOverTime == nDetail.StartOverTime &&
                             d.EmpCode == nDetail.EmpCode && d.OverTimeDetailStatus == OverTimeDetailStatus.Use;
                        // check if employee on auther overtime continue him
                        if (await this.repositoryOverTimeDetail.AnyDataAsync(condition))
                        {
                            remove.Add(nDetail);
                            var emp = await this.repositoryEmployee.GetAsync(nDetail.EmpCode);
                            if (emp != null)
                                emps.Add($"{emp.EmpCode} คุณ{emp.NameThai}");

                            continue;
                        }

                        if (nDetail.OverTimeDetailStatus == null)
                            nDetail.OverTimeDetailStatus = OverTimeDetailStatus.Use;
                        if (nDetail.Employee != null)
                            nDetail.Employee = null;
                        //Set Create
                        nDetail.CreateDate = nOverTimeMaster.CreateDate;
                        nDetail.Creator = nOverTimeMaster.Creator;
                    }
                }

                if (remove.Any())
                {
                    remove.ForEach(item =>
                    {
                        nOverTimeMaster.OverTimeDetails.Remove(item);
                    });
                }

                if (nOverTimeMaster.OverTimeDetails.Any())
                {
                    return new JsonResult(new
                    {
                        OverTimeMaster = await this.repository.AddAsync(nOverTimeMaster),
                        Remove = emps,
                        isRemove = emps.Any()
                    }, this.DefaultJsonSettings);
                }
                else
                {
                    return new JsonResult(new
                    {
                        OverTimeMaster = nOverTimeMaster,
                        Remove = emps,
                        isRemove = emps.Any()
                    }, this.DefaultJsonSettings);
                }
            }

            return NotFound(new { Error = Message });
        }
        #endregion

        #region PUT
        // PUT: api/OverTimeMaster/5
        [HttpPut("{key}")]
        public async Task<IActionResult> PutByNumber(int key, [FromBody]OverTimeMaster uOverTimeMaster)
        {
            if (uOverTimeMaster != null)
            {
                // add hour to DateTime to set Asia/Bangkok
                uOverTimeMaster = helpers.AddHourMethod(uOverTimeMaster);

                uOverTimeMaster.ModifyDate = DateTime.Now;
                uOverTimeMaster.Modifyer = uOverTimeMaster.Modifyer ?? "Someone";

                //********************** For Old GoogleChorme **************************//
                if (uOverTimeMaster.OverTimeStatus != OverTimeStatus.Required)
                {
                    var dbOverTimeMaster = await this.repository.GetAsync(key);
                    if (dbOverTimeMaster != null)
                        uOverTimeMaster.OverTimeDate = dbOverTimeMaster.OverTimeDate;
                }
                //**********************************************************************//

                if (uOverTimeMaster.Creator == uOverTimeMaster.Modifyer)
                {
                    if (uOverTimeMaster.OverTimeStatus == OverTimeStatus.WaitActual &&
                        !string.IsNullOrEmpty(uOverTimeMaster.InfoActual))
                    {
                        uOverTimeMaster.OverTimeStatus = OverTimeStatus.Complate;
                    }
                }

                if (uOverTimeMaster.ProjectCodeMaster != null)
                    uOverTimeMaster.ProjectCodeMaster = null;

                if (uOverTimeMaster.EmployeeGroup != null)
                    uOverTimeMaster.EmployeeGroup = null;

                if (uOverTimeMaster.EmployeeGroupMIS != null)
                    uOverTimeMaster.EmployeeGroupMIS = null;

                if (uOverTimeMaster.ApproveBy != null)
                    uOverTimeMaster.ApproveBy = null;

                if (uOverTimeMaster.RequireBy != null)
                    uOverTimeMaster.RequireBy = null;

                if (uOverTimeMaster.OverTimeDetails != null)
                {
                    foreach (var uDetail in uOverTimeMaster.OverTimeDetails)
                    {
                        if (uDetail.OverTimeDetailStatus == null)
                            uDetail.OverTimeDetailStatus = OverTimeDetailStatus.Use;
                        if (uDetail.Employee != null)
                            uDetail.Employee = null;

                        if (uDetail.OverTimeMasterId > 0)
                        {
                            //ModifyDate
                            uDetail.ModifyDate = uOverTimeMaster.ModifyDate;
                            uDetail.Modifyer = uOverTimeMaster.Modifyer;
                        }
                        else
                        {
                            uDetail.CreateDate = uOverTimeMaster.ModifyDate;
                            uDetail.Creator = uOverTimeMaster.Modifyer;
                        }
                    }
                }

                // update Master not update Detail it need to update Detail directly
                var updateComplate = await this.repository.UpdateAsync(uOverTimeMaster, key);
                List<string> emps = new List<string>();

                if (updateComplate != null)
                {
                    // filter
                    Expression<Func<OverTimeDetail, bool>> condition = d => d.OverTimeMasterId == key;
                    var dbOverTimeDetails = this.repositoryOverTimeDetail.FindAll(condition);

                    //Remove OverTimeDetail if edit remove it
                    foreach (var dbOvertimeDetail in dbOverTimeDetails)
                    {
                        if (!uOverTimeMaster.OverTimeDetails.Any(x => x.OverTimeDetailId == dbOvertimeDetail.OverTimeDetailId))
                            await this.repositoryOverTimeDetail.DeleteAsync(dbOvertimeDetail.OverTimeDetailId);
                    }

                    //Update OverTimeDetails
                    foreach (var uOvertime in uOverTimeMaster.OverTimeDetails)
                    {
                        if (uOvertime.OverTimeDetailId > 0)
                            await this.repositoryOverTimeDetail.UpdateAsync(uOvertime, uOvertime.OverTimeDetailId);
                        else
                        {
                            Expression<Func<OverTimeDetail, bool>> conditionD = d =>
                                d.OverTimeMaster.OverTimeStatus != OverTimeStatus.Cancel &&
                                d.OverTimeMaster.OverTimeDate.Date == uOverTimeMaster.OverTimeDate.Date &&
                                d.StartOverTime == uOvertime.StartOverTime &&
                                d.EmpCode == uOvertime.EmpCode && d.OverTimeDetailStatus == OverTimeDetailStatus.Use;
                            // check if employee on auther overtime continue him
                            if (await this.repositoryOverTimeDetail.AnyDataAsync(conditionD))
                            {
                                var emp = await this.repositoryEmployee.GetAsync(uOvertime.EmpCode);
                                if (emp != null)
                                    emps.Add($"{emp.EmpCode} คุณ{emp.NameThai}");

                                continue;
                            }

                            if (uOvertime.OverTimeMasterId < 1)
                                uOvertime.OverTimeMasterId = uOverTimeMaster.OverTimeMasterId;

                            await this.repositoryOverTimeDetail.AddAsync(uOvertime);
                        }
                    }
                }

                // return new JsonResult(updateComplate, this.DefaultJsonSettings);
                return new JsonResult(new
                {
                    OverTimeMaster = updateComplate,
                    Remove = emps,
                    isRemove = emps.Any()
                }, this.DefaultJsonSettings);
            }
            return NotFound(new { Error = "OverTimeMaster not found. " });
        }
        // PUT: api/OverTimeMaster/UpdateStatus/5
        [HttpPut("UpdateStatus/{key}")]
        public async Task<IActionResult> UpdateStatusOverTimeMaster(int key, [FromBody]OverTimeMaster uOverTimeMaster)
        {
            if (uOverTimeMaster != null)
            {
                var dbOverTimeMaster = await this.repository.GetAsync(key);

                if (dbOverTimeMaster != null)
                {

                    dbOverTimeMaster.OverTimeStatus = uOverTimeMaster.OverTimeStatus;
                    dbOverTimeMaster.EmpApprove = uOverTimeMaster.EmpApprove;

                    dbOverTimeMaster.ModifyDate = DateTime.Now;
                    dbOverTimeMaster.Modifyer = uOverTimeMaster.Modifyer ?? "Someone";

                    return new JsonResult(await this.repository.UpdateAsync(dbOverTimeMaster, key), this.DefaultJsonSettings);
                }


            }
            return NotFound(new { Error = "OverTimeMaster not found. " });
        }
        #endregion

        #region DELETE
        // DELETE: api/TaskMachine/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return new JsonResult(await this.repository.DeleteAsync(id), this.DefaultJsonSettings);
        }
        #endregion

        #region REPORT
        // GET: api/GetReportOverTimePdf/5

        [HttpGet("GetReportOverTimePdf/{OverTimeMasterId}")]
        public async Task<IActionResult> GetReportOverTimePdf(int OverTimeMasterId, [FromServices] INodeServices nodeServices)
        {
            string Message = "Not found overtime masterid.";
            try
            {
                if (OverTimeMasterId > 0)
                {
                    var QueryData = await this.repository.GetAllAsQueryable()
                                                         .Include(x => x.EmployeeGroup)
                                                         .Include(x => x.ProjectCodeMaster)
                                                         .Include(x => x.ApproveBy)
                                                         .Include(x => x.RequireBy)
                                                         .Include(x => x.LastOverTimeMaster)
                                                         .Include(x => x.OverTimeDetails)
                                                            .ThenInclude(x => x.Employee)
                                                         .FirstOrDefaultAsync(x => x.OverTimeMasterId == OverTimeMasterId);

                    if (QueryData != null)
                    {
                        // Check year Thai
                        string year = QueryData.OverTimeDate.Year > 2500 ?
                            QueryData.OverTimeDate.Year.ToString() :
                            (QueryData.OverTimeDate.Year + 543).ToString();
                        // Check type of DayOfWeek
                        var isWeekDay = QueryData.OverTimeDate.DayOfWeek != DayOfWeek.Sunday;
                        var ThreeTime = false;

                        // Get ReportOverTimeMaster
                        var ReportOverTimeMaster = new ReportOverTimeMasterViewModel()
                        {
                            ApproverBy = QueryData.ApproveBy == null ? "" : $"คุณ{QueryData?.ApproveBy?.NameThai ?? ""}",
                            DateOverTime = QueryData.OverTimeDate.ToString("dd/MM/") + year,
                            GroupName = QueryData?.EmployeeGroup?.Description ?? "",
                            JobNumber = $"{(QueryData?.ProjectCodeMaster?.ProjectCode ?? "")} {(QueryData?.ProjectCodeMaster?.ProjectName ?? "")}",
                            LastActual = QueryData?.LastOverTimeMaster?.InfoActual ?? "",
                            LastPlan = QueryData?.LastOverTimeMaster?.InfoPlan ?? "",
                            NowPlan = QueryData?.InfoPlan ?? "",
                            RequireBy = QueryData.RequireBy == null ? "" : $"คุณ{QueryData?.RequireBy?.NameThai ?? ""}",
                            OnePointFiveTime = isWeekDay ? 1 : 0,
                            OneTime = 0,
                            ThreeTime = 0,
                            Total = QueryData?.OverTimeDetails.Count(x => x.OverTimeDetailStatus != OverTimeDetailStatus.Cancel) ?? 0,
                            TypeWeekDay = isWeekDay ? 1 : 0,
                            TypeWeekEnd = isWeekDay ? 0 : 1,
                            TwoTime = isWeekDay ? 0 : 1,
                            // Detail
                            Details = new List<ReportOverTimeDetailViewModel>(),
                        };

                        int running = 1;
                        // Get ReportOverTimeDetail
                        foreach (var detail in QueryData.OverTimeDetails)
                        {
                            if (!isWeekDay)
                            {
                                if (detail.TotalHour > 8)
                                    ThreeTime = true;
                            }

                            var Stime = new TimeSpan();
                            var Etime = new TimeSpan();

                            if (isWeekDay)
                            {
                                Stime = new TimeSpan(17, 0, 0);
                                Etime = new TimeSpan((int)(detail.TotalHour) + 17, 0, 0);
                            }
                            else
                            {
                                var AddHour = detail.TotalHour < 5 ? detail.TotalHour + 8 : detail.TotalHour + 9;

                                Stime = new TimeSpan(8, 0, 0);
                                Etime = new TimeSpan((int)AddHour, 0, 0);
                            }

                            ReportOverTimeMaster.Details.Add(new ReportOverTimeDetailViewModel()
                            {
                                EndTime = Etime.ToString(@"hh\:mm"),
                                HourOverTime = (int)detail.TotalHour,
                                Name = detail.Employee == null ? $"คุณ{detail?.Employee?.NameThai ?? ""}" : "",
                                Remark = detail?.Remark ?? "",
                                RowNumber = running,
                                StartTime = Stime.ToString(@"hh\:mm")
                            });

                            running++;
                        }

                        for (int i = running; i < 38; i++)
                        {
                            ReportOverTimeMaster.Details.Add(new ReportOverTimeDetailViewModel()
                            {
                                EndTime = "",
                                HourOverTime = 0,
                                Remark = "",
                                RowNumber = 0,
                                StartTime = ""
                            });
                        }

                        if (ThreeTime)
                            ReportOverTimeMaster.ThreeTime = 1;

                        if (ReportOverTimeMaster != null)
                        {
                            HttpClient hc = new HttpClient();
                            var htmlContent = await hc.GetStringAsync($"http://{Request.Host}/reports/overtime-report2.html");
                            //Class to Json
                            var Json = JsonConvert.SerializeObject(ReportOverTimeMaster, this.DefaultJsonSettings);
                            // Result
                            var result = await nodeServices.InvokeAsync<byte[]>("./JavaScript/exportpdf", htmlContent, Json);
                            return File(result, "application/pdf", "overtimereport.pdf");
                        }
                    }
                }

            }
            catch(Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }
            return NotFound(new { Error = Message });

            //return new ContentResult();
        }

        // GET: api/GetReportOverTimePdf2/5
        [HttpGet("GetReportOverTimePdf2/{OverTimeMasterId}")]
        public async Task<IActionResult> GetReportOverTimePdf2(int OverTimeMasterId)
        {
            string Message = "Not found overtime masterid.";
            try
            {
                if (OverTimeMasterId > 0)
                {
                    Expression<Func<HolidayOverTime, bool>> condition = h => h.HolidayStatus != HolidayStatus.Cancel && 
                                                                             h.HolidayDate != null;
                    var Holiday = await this.repositoryHoliday.GetAllWithConditionAndIncludeAsync(condition);

                    // var HoiDay = new List<DateTime>()
                    // {
                    //    new DateTime(2017,12,5),
                    //    new DateTime(2017,12,30),
                    //    new DateTime(2017,12,31),
                    // };

                    var QueryData = await this.repository.GetAllAsQueryable()
                                                         .Include(x => x.EmployeeGroup)
                                                         .Include(x => x.EmployeeGroupMIS)
                                                         .Include(x => x.ProjectCodeMaster)
                                                         .Include(x => x.ApproveBy)
                                                         .Include(x => x.RequireBy)
                                                         .Include(x => x.LastOverTimeMaster)
                                                         .Include(x => x.OverTimeDetails)
                                                            .ThenInclude(x => x.Employee)
                                                         .FirstOrDefaultAsync(x => x.OverTimeMasterId == OverTimeMasterId);

                    if (QueryData != null)
                    {
                        // Check year Thai
                        string year = QueryData.OverTimeDate.Year > 2500 ?
                                      QueryData.OverTimeDate.Year.ToString() :
                                     (QueryData.OverTimeDate.Year + 543).ToString();
                        // Check type of DayOfWeek
                        var isWeekDay = QueryData.OverTimeDate.DayOfWeek != DayOfWeek.Sunday && !Holiday.Any(x => x.HolidayDate.Value.Date == QueryData.OverTimeDate.Date);
                        // isWeekDay = !Holiday.Any(x => x.HolidayDate.Value.Date == QueryData.OverTimeDate.Date);
                        var Yesitday1 = QueryData.OverTimeDate.AddDays(-1);
                        if (!isWeekDay)
                        {
                            
                            var TypeDay1 = Yesitday1.DayOfWeek != DayOfWeek.Sunday && !Holiday.Any(x => x.HolidayDate.Value.Date == Yesitday1.Date);
                            if (QueryData.OverTimeDetails.Any(z => z.StartOverTime.HasValue) && TypeDay1)
                                isWeekDay = QueryData.OverTimeDetails.Any(z => z.StartOverTime != null && z.StartOverTime < 8);
                        }
                        else
                        {
                            var TypeDay2 = Yesitday1.DayOfWeek == DayOfWeek.Sunday || Holiday.Any(x => x.HolidayDate.Value.Date == Yesitday1.Date);
                            if (QueryData.OverTimeDetails.Any(z => z.StartOverTime.HasValue) && TypeDay2)
                                isWeekDay = !(QueryData.OverTimeDetails.Any(z => z.StartOverTime != null && z.StartOverTime < 8));
                        }
                        var ThreeTime = false;

                        // Get ReportOverTimeMaster
                        var ReportOverTimeMaster = new ReportOverTimeMasterViewModel()
                        {
                            ApproverBy = QueryData.ApproveBy == null ? "" : $"คุณ{QueryData?.ApproveBy?.NameThai ?? ""}",
                            DateOverTime = QueryData.OverTimeDate.ToString("dd/MM/") + year,
                            GroupName = (QueryData.EmployeeGroupMIS == null ? "" : $"{QueryData?.EmployeeGroupMIS?.GroupDesc}"),
                            JobNumber = $"{(QueryData?.ProjectCodeMaster?.ProjectCode ?? "")} {(QueryData?.ProjectCodeMaster?.ProjectName ?? "")}",
                            LastActual = QueryData?.LastOverTimeMaster?.InfoActual ?? "",
                            LastPlan = QueryData?.LastOverTimeMaster?.InfoPlan ?? "",
                            NowPlan = QueryData?.InfoPlan ?? "",
                            RequireBy = QueryData.RequireBy == null ? "" : $"คุณ{QueryData?.RequireBy?.NameThai ?? ""}",
                            OnePointFiveTime = isWeekDay ? 1 : 0,
                            OneTime = 0,
                            ThreeTime = 0,
                            Total = QueryData?.OverTimeDetails.Count(x => x.OverTimeDetailStatus != OverTimeDetailStatus.Cancel) ?? 0,
                            TypeWeekDay = isWeekDay ? 1 : 0,
                            TypeWeekEnd = isWeekDay ? 0 : 1,
                            TwoTime = isWeekDay ? 0 : 1,
                            // Detail
                            Details = new List<ReportOverTimeDetailViewModel>(),
                        };

                        int running = 1;
                        // Get ReportOverTimeDetail
                        foreach (var detail in QueryData.OverTimeDetails.Where(x => x.OverTimeDetailStatus != OverTimeDetailStatus.Cancel)
                                                        .OrderBy(x => x.EmpCode.Length).ThenBy(x => x.EmpCode))
                        {
                            var Stime = new TimeSpan();
                            var Etime = new TimeSpan();

                            if (isWeekDay)
                            {
                                Stime = detail.StartOverTime.HasValue && detail?.StartOverTime > 0 ? new TimeSpan(detail.StartOverTime.Value,0,0) : new TimeSpan(17, 0, 0);
                                Etime = new TimeSpan((int)(detail.TotalHour) + Stime.Hours, 0, 0);
                            }
                            else
                            {
                                Stime = detail.StartOverTime.HasValue && detail?.StartOverTime > 0 ? new TimeSpan(detail.StartOverTime.Value, 0, 0) : new TimeSpan(8, 0, 0);
                                var AddHour = detail.TotalHour < 5 ? detail.TotalHour + Stime.Hours : detail.TotalHour + Stime.Hours + 1;
                                Etime = new TimeSpan((int)AddHour, 0, 0);

                                if (detail.TotalHour > 8)
                                    ThreeTime = true;
                            }

                            ReportOverTimeMaster.Details.Add(new ReportOverTimeDetailViewModel()
                            {
                                EndTime = Etime.ToString(@"hh\:mm"),
                                HourOverTime = (int)detail.TotalHour,
                                Name = detail.Employee == null ? "" : $"คุณ{detail?.Employee?.NameThai ?? ""}",
                                Remark = detail?.Remark ?? "",
                                RowNumber = running,
                                StartTime = Stime.ToString(@"hh\:mm")
                            });
                            running++;
                        }

                        int removeLine = 0;
                        if (!string.IsNullOrEmpty(ReportOverTimeMaster.LastActual))
                        {
                            if (ReportOverTimeMaster.LastActual.Length / 320 >= 1)
                                removeLine += (int)Math.Ceiling(((double)ReportOverTimeMaster.LastActual.Length / (double)320));
                        }

                        if (!string.IsNullOrEmpty(ReportOverTimeMaster.LastPlan))
                        {
                            if (ReportOverTimeMaster.LastPlan.Length / 320 >= 1)
                                removeLine += (int)Math.Ceiling(((double)ReportOverTimeMaster.LastPlan.Length / (double)320));
                        }

                        if (!string.IsNullOrEmpty(ReportOverTimeMaster.NowPlan))
                        {
                            if (ReportOverTimeMaster.NowPlan.Length / 320 >= 1)
                                removeLine += (int)Math.Ceiling(((double)ReportOverTimeMaster.NowPlan.Length / (double)320));
                        }

                        for (int i = running; i < (24 - removeLine); i++)
                        {
                            ReportOverTimeMaster.Details.Add(new ReportOverTimeDetailViewModel()
                            {
                                EndTime = "",
                                HourOverTime = 0,
                                Remark = "",
                                RowNumber = 0,
                                StartTime = ""
                            });
                        }

                        if (ThreeTime)
                            ReportOverTimeMaster.ThreeTime = 1;

                        if (ReportOverTimeMaster != null)
                        {
                            return new JsonResult(ReportOverTimeMaster, this.DefaultJsonSettings);
                        }
                    }
                }

            }
            catch (Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }
            return NotFound(new { Error = Message });

            //return new ContentResult();
        }

        // POST: api/GetReportSummary/
        [HttpPost("GetReportSummary")]
        public async Task<IActionResult> GetReportSummary([FromBody]OptionOverTimeSchedule option)
        {
            if (option != null)
            {
                var QueryData = this.repository.GetAllAsQueryable()
                                                .Where(x =>
                                                    x.OverTimeStatus == OverTimeStatus.WaitActual ||
                                                    x.OverTimeStatus == OverTimeStatus.Complate)
                                                .Include(x => x.OverTimeDetails)
                                                    .ThenInclude(x => x.Employee)
                                                .Include(x => x.ProjectCodeMaster)
                                                .Include(x => x.EmployeeGroupMIS)
                                                .AsQueryable();
                if (option.SDate.HasValue)
                {
                    option.SDate = option.SDate.Value.AddHours(7);
                    QueryData = QueryData.Where(x => x.OverTimeDate.Date == option.SDate.Value.Date);

                }

                var Datas = await QueryData.ToListAsync();

                var ReportSummary = new List<ReportOverTimeSummary>();
                var Runing = 1;

                foreach(var item in Datas.OrderBy(x => x.EmployeeGroupMIS.GroupDesc).GroupBy(x => x.EmployeeGroupMIS))
                {
                    if (item == null)
                        continue;

                    Expression<Func<Employee, bool>> condition = e => e.GroupMIS == item.Key.GroupMIS;
                    var ToltalGroup = await this.repositoryEmployee.CountWithMatchAsync(condition);
                    var TotalOvertime = 0;

                    foreach(var item2 in item.Select(x => x.OverTimeDetails))
                        TotalOvertime += item2.Where(x => x.OverTimeDetailStatus == OverTimeDetailStatus.Use).Count();

                    var newReport = new ReportOverTimeSummary()
                    {
                        GroupName = item?.Key?.GroupDesc ?? "-",
                        ProjectNumber = string.Join(", ", item?.Select(x => x.ProjectCodeMaster.ProjectCode + 
                                       (item.Count() > 1 ? $"[{x.OverTimeDetails.Count(z => z.OverTimeDetailStatus == OverTimeDetailStatus.Use)}]" : "") ?? "-")),
                        Remark = "",
                        Runing = Runing,
                        TotalOfGroup = ToltalGroup,
                        TotalOfOverTime = TotalOvertime,
                    };
                    Runing++;
                    ReportSummary.Add(newReport);
                }

                if (ReportSummary.Any())
                {
                    return new JsonResult(new
                    {
                        TotalGroup = ReportSummary.Sum(x => x.TotalOfGroup),
                        TotalOverTime = ReportSummary.Sum(x => x.TotalOfOverTime),
                        Details = ReportSummary
                    },this.DefaultJsonSettings);
                }
            }
            return NotFound(new { NotFound = "Not Found Data." });
        }

        // POST: api/GetReportSummaryOnlyWorkShop/
        [HttpPost("GetReportSummaryOnlyWorkShop")]
        public async Task<IActionResult> GetReportSummaryOnlyWorkShop([FromBody] OptionOverTimeSchedule option)
        {
            if (option != null)
            {
                var OnlyWorkGroup = await this.repositoryWorkGroupHasShop.GetAllAsQueryable()
                                              .Include(x => x.WorkShop)
                                              .ToListAsync();
                if (!OnlyWorkGroup.Any())
                    return BadRequest(new { Error = "Data not been found." });

                var QueryData = this.repository.GetAllAsQueryable()
                                                .Where(x => OnlyWorkGroup.Select(z => z.GroupMIS).Contains(x.GroupMIS) && 
                                                           (x.OverTimeStatus == OverTimeStatus.WaitActual ||
                                                            x.OverTimeStatus == OverTimeStatus.Complate))
                                                .Include(x => x.OverTimeDetails)
                                                    .ThenInclude(x => x.Employee)
                                                .Include(x => x.ProjectCodeMaster)
                                                .Include(x => x.EmployeeGroupMIS)
                                                .AsQueryable();

                if (option.SDate.HasValue)
                {
                    option.SDate = option.SDate.Value.AddHours(7);
                    QueryData = QueryData.Where(x => x.OverTimeDate.Date == option.SDate.Value.Date);
                }

                var Datas = await QueryData.ToListAsync();
                var ReportSummary = new List<ReportOverTimeSummaryByWorkShop>();
                //Group of work shop
                var GroupOfShop1 = OnlyWorkGroup.Where(z =>z.WorkShop.WorkShopName.ToLower().Contains("shop1"))
                                                .Select(z => z.GroupMIS);
                var GroupOfShop2 = OnlyWorkGroup.Where(z => z.WorkShop.WorkShopName.ToLower().Contains("shop2"))
                                                .Select(z => z.GroupMIS);

                // Gen work shop header name
                foreach (var TeamName in OnlyWorkGroup.GroupBy(x => x.TeamName))
                    ReportSummary.Add(new ReportOverTimeSummaryByWorkShop()
                    {
                        WorkShopName = TeamName.Key,
                        ReportOverTimeSummaries = new List<ReportOverTimeSummaryWithShop>()
                    });
                // Foreach by ProjectMaster
                foreach (var GroupProject in Datas.OrderBy(x => x.ProjectCodeMaster.ProjectCode)
                    .GroupBy(x => x.ProjectCodeMaster))
                {
                    if (GroupProject == null)
                        continue;

                    var FabTeams = GroupProject.Where(x => OnlyWorkGroup.Where(z => z.TeamName.ToLower().Contains("fab"))
                                                                       .Select(z => z.GroupMIS).Contains(x.GroupMIS));
                    if (FabTeams.Any())
                    {
                        var NewReportData = new ReportOverTimeSummaryWithShop()
                        {
                            ProjectNumber = GroupProject.Key.ProjectCode,
                            GroupNameShop1 = string.Join
                                (", ", FabTeams.Where
                                    (x => GroupOfShop1.Contains(x.GroupMIS))
                                        .Select(x => $"{x.EmployeeGroupMIS.GroupDesc}" +
                                                    $"[{x.OverTimeDetails.Count(z => z.OverTimeDetailStatus == OverTimeDetailStatus.Use)}]"
                                    )
                                ),
                            GroupNameShop2 = string.Join
                                (", ", FabTeams.Where
                                    (x => GroupOfShop2.Contains(x.GroupMIS))
                                        .Select(x => $"{x.EmployeeGroupMIS.GroupDesc}" +
                                                    $"[{x.OverTimeDetails.Count(z => z.OverTimeDetailStatus == OverTimeDetailStatus.Use)}]"
                                    )
                                ),
                            TotalShop1 = FabTeams.Where(x => GroupOfShop1.Contains(x.GroupMIS))
                                                 .Select(x => x.OverTimeDetails.Count(z => z.OverTimeDetailStatus == OverTimeDetailStatus.Use)).Sum(),
                            TotalShop2 = FabTeams.Where(x => GroupOfShop2.Contains(x.GroupMIS))
                                                 .Select(x => x.OverTimeDetails.Count(z => z.OverTimeDetailStatus == OverTimeDetailStatus.Use)).Sum(),
                        };
                        ReportSummary.FirstOrDefault(x => x.WorkShopName.ToLower().Contains("fab"))
                            .ReportOverTimeSummaries.Add(NewReportData);
                    }

                    var WeldTeams = GroupProject.Where(x => OnlyWorkGroup.Where(z => z.TeamName.ToLower().Contains("welder"))
                                                                       .Select(z => z.GroupMIS).Contains(x.GroupMIS));
                    if (WeldTeams.Any())
                    {
                        var NewReportData2 = new ReportOverTimeSummaryWithShop()
                        {
                            ProjectNumber = GroupProject.Key.ProjectCode,
                            GroupNameShop1 = string.Join
                                (", ", WeldTeams.Where
                                    (x => GroupOfShop1.Contains(x.GroupMIS))
                                        .Select(x => $"{x.EmployeeGroupMIS.GroupDesc}" +
                                                    $"[{x.OverTimeDetails.Count(z => z.OverTimeDetailStatus == OverTimeDetailStatus.Use)}]" +
                                                    (string.IsNullOrEmpty(x.HiddenText) ? "" :  $"[{x.HiddenText}]")
                                    )
                                ),
                            GroupNameShop2 = string.Join
                                (", ", WeldTeams.Where
                                    (x => GroupOfShop2.Contains(x.GroupMIS))
                                        .Select(x => $"{x.EmployeeGroupMIS.GroupDesc}" +
                                                    $"[{x.OverTimeDetails.Count(z => z.OverTimeDetailStatus == OverTimeDetailStatus.Use)}]" +
                                                    (string.IsNullOrEmpty(x.HiddenText) ? "" : $"[{x.HiddenText}]")
                                    )
                                ),
                            TotalShop1 = WeldTeams.Where(x => GroupOfShop1.Contains(x.GroupMIS))
                                                 .Select(x => x.OverTimeDetails.Count(z => z.OverTimeDetailStatus == OverTimeDetailStatus.Use)).Sum(),
                            TotalShop2 = WeldTeams.Where(x => GroupOfShop2.Contains(x.GroupMIS))
                                                 .Select(x => x.OverTimeDetails.Count(z => z.OverTimeDetailStatus == OverTimeDetailStatus.Use)).Sum(),
                        };
                        ReportSummary.FirstOrDefault(x => x.WorkShopName.ToLower().Contains("welder"))
                            .ReportOverTimeSummaries.Add(NewReportData2);
                    }
                }

                if (ReportSummary.Any())
                {
                    return new JsonResult(new
                    {
                        ReportSummary,
                        GrandTotalShop1 = ReportSummary.Sum(x => x.ReportOverTimeSummaries.Sum(z => z.TotalShop1)),
                        GrandTotalShop2 = ReportSummary.Sum(x => x.ReportOverTimeSummaries.Sum(z => z.TotalShop2))
                    }, this.DefaultJsonSettings);
                }
            }
            return NotFound(new { NotFound = "Not Found Data." });
        }

        // POST: api/GetReportSummaryByProject/
        [HttpPost("GetReportSummaryByProject")]
        public async Task<IActionResult> GetReportSummaryByProject([FromBody]List<int?> JobNumber)
        {
            var Message = "";
            try
            {
                if (JobNumber != null)
                {
                    var QueryData = this.repository.GetAllAsQueryable()
                                               .Where(x =>
                                                   x.OverTimeStatus == OverTimeStatus.WaitActual ||
                                                   x.OverTimeStatus == OverTimeStatus.Complate)
                                               .Include(x => x.OverTimeDetails)
                                                   .ThenInclude(x => x.Employee)
                                               .Include(x => x.ProjectCodeMaster)
                                               .Include(x => x.EmployeeGroupMIS)
                                               .AsQueryable();

                    QueryData = QueryData.Where(x => JobNumber.Contains(x.ProjectCodeMasterId));

                    var Data = await QueryData.ToListAsync();
                    var ListData = new List<OverTimeSummaryByProViewModel>();
                    // GroupBy GroupCode
                    foreach (var item in Data.GroupBy(x => x.ProjectCodeMaster)
                        .OrderBy(x => x.Key.ProjectCode))
                    {
                        var TotalOvertime = 0;
                        var TotalHour = 0.0;

                        foreach (var item2 in item.Select(x => x.OverTimeDetails))
                        {
                            TotalOvertime += item2.Where(x => x.OverTimeDetailStatus == OverTimeDetailStatus.Use).Count();
                            TotalHour += item2.Where(x => x.OverTimeDetailStatus == OverTimeDetailStatus.Use).Sum(x => x.TotalHour);
                        }
                        ListData.Add(new OverTimeSummaryByProViewModel
                        {
                            JobNumber = item.Key.ProjectCode,
                            JobName = item.Key.ProjectName,
                            TotalHr = TotalHour,
                            TotalMan = TotalOvertime
                        });
                    }

                    //var ListData = await QueryData.GroupBy(x => x.ProjectCodeMaster)
                    //                                .Select(x => new
                    //                                {
                    //                                    JobNumber = x.Key.ProjectCode,
                    //                                    JobName = x.Key.ProjectName,
                    //                                    TotalHr = x.Sum(z => z.OverTimeDetails
                    //                                                        .Where(c => c.OverTimeDetailStatus == OverTimeDetailStatus.Use)
                    //                                                        .Sum(c => c.TotalHour))
                    //                                }).ToListAsync();

                    return new JsonResult(ListData, this.DefaultJsonSettings);
                }
            }
            catch(Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }
            return BadRequest(new { Error = Message });
        }
        #endregion

        #region CHART

        // POST: api/PostOverTimeChart/
        [HttpPost("PostOverTimeChartData")]
        public async Task<IActionResult> PostOverTimeChartData([FromBody]OptionChartOTViewModel Option)
        {
            var Message = "Not found OverTimeMaster data.";
            try
            {
                if (Option != null)
                {
                    var QueryData = this.repository.GetAllAsQueryable()
                                                   .Where(x => x.OverTimeStatus == OverTimeStatus.Complate ||
                                                               x.OverTimeStatus == OverTimeStatus.WaitActual)
                                                   .Include(x => x.OverTimeDetails)
                                                   .Include(x => x.ProjectCodeMaster)
                                                   .Include(x => x.EmployeeGroupMIS)
                                                   .AsQueryable();

                    if (!string.IsNullOrEmpty(Option.GroupCode))
                        QueryData = QueryData.Where(x => x.GroupMIS == Option.GroupCode);

                    if (Option.ProjectMaster.HasValue)
                        QueryData = QueryData.Where(x => x.ProjectCodeMasterId == Option.ProjectMaster);

                    if (Option.SelectedDate.HasValue)
                    {
                        var selectedDate = Option.SelectedDate.Value.AddHours(7);
                        QueryData = QueryData.Where(x => x.OverTimeDate.Date == selectedDate.Date);
                    }

                    List<string> Labels = new List<string>();
                    List<double> ChartDatas = new List<double>();

                    if (Option.TypeChart.HasValue)
                    {
                        var Data = await QueryData.ToListAsync();
                        // All Group Code
                        if (Option.TypeChart.Value == 1)
                        {
                            // GroupBy GroupCode
                            foreach (var item in Data.GroupBy(x => x.EmployeeGroupMIS)
                                .OrderBy(x => x.Sum(y => y.OverTimeDetails.Count())))
                            {
                                var TotalOvertime = 0;
                                var TotalHour = 0.0;
                                foreach (var item2 in item.Select(x => x.OverTimeDetails))
                                {
                                    TotalOvertime += item2.Where(x => x.OverTimeDetailStatus == OverTimeDetailStatus.Use).Count();
                                    TotalHour += item2.Where(x => x.OverTimeDetailStatus == OverTimeDetailStatus.Use).Sum(x => x.TotalHour);
                                }
                                ChartDatas.Add(TotalOvertime);
                                Labels.Add($"{item.Key.GroupDesc} {TotalOvertime} Man {TotalHour} Hr");
                            }
                        }
                        // Chart GroupCode down ProjectMaster
                        else if (Option.TypeChart.Value == 2)
                        {
                            // GroupBy GroupCode
                            foreach (var item in Data.GroupBy(x => x.ProjectCodeMaster)
                                .OrderBy(x => x.Sum(y => y.OverTimeDetails.Count())))
                            {
                                var TotalOvertime = 0;
                                var TotalHour = 0.0;

                                foreach (var item2 in item.Select(x => x.OverTimeDetails))
                                {
                                    TotalOvertime += item2.Where(x => x.OverTimeDetailStatus == OverTimeDetailStatus.Use).Count();
                                    TotalHour += item2.Where(x => x.OverTimeDetailStatus == OverTimeDetailStatus.Use).Sum(x => x.TotalHour);
                                }
                                ChartDatas.Add(TotalOvertime);
                                Labels.Add($"{item.Key.ProjectCode} {TotalOvertime} Man {TotalHour} Hr");
                            }
                        }

                        if (Labels.Any() && ChartDatas.Any())
                        {
                            var Total = ChartDatas.Sum();
                            //var ChartDataPers = new List<double>();
                            //ChartDatas.ForEach(item => {
                            //    ChartDataPers.Add(Math.Round((item / Total) * 100, 1));
                            //});

                            for (int i = 0; i < ChartDatas.Count(); i++)
                            {
                                ChartDatas[i] = Math.Round((ChartDatas[i] / Total) * 100, 1);
                                Labels[i] += $" {ChartDatas[i]}%";
                            }

                            return new JsonResult(new {
                                Labels = Labels,
                                Datas = ChartDatas
                            }, this.DefaultJsonSettings);
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
    }
}
