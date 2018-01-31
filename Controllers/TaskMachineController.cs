using AutoMapper;
using Newtonsoft.Json;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;

using System;
using System.IO;
using System.Net;
using System.Linq;
using System.Dynamic;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Linq.Expressions;
using System.Collections.Generic;

using VipcoMachine.Models;
using VipcoMachine.Helpers;
using VipcoMachine.ViewModels;
using VipcoMachine.Services.Interfaces;

using ReportClasses;

namespace VipcoMachine.Controllers
{
    [Produces("application/json")]
    [Route("api/TaskMachine")]
    public class TaskMachineController : Controller
    {
        #region PrivateMembers
        private IRepository<TaskMachine> repository;
        private IRepository<NoTaskMachine> repositoryNoTask;
        private IRepository<TaskMachineHasOverTime> repositoryOverTime;
        private IRepository<Machine> repositoryMachine;
        private IRepository<MachineHasOperator> repositoryOperator;
        private IRepository<JobCardDetail> repositoryJobDetail;
        private IRepository<JobCardMaster> repositoryJobMaster;
        private IRepository<User> repositoryUser;
        private IMapper mapper;
        private IHostingEnvironment hostingEnvironment;
        private HelpersClass<TaskMachine> helpers;
        private ValidEmail validEmail;

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
        private async Task<JobCardDetail> UpdateJobCard(int JobCardDetailId,string Create, JobCardDetailStatus Status = JobCardDetailStatus.Task)
        {
            var Includes = new List<string> { "JobCardMaster"  };
            var jobCardDetail = await this.repositoryJobDetail.GetAsynvWithIncludes(JobCardDetailId, "JobCardDetailId",Includes);
            if (jobCardDetail != null)
            {
                jobCardDetail.JobCardDetailStatus = Status;
                jobCardDetail.ModifyDate = DateTime.Now;
                jobCardDetail.Modifyer = Create;
                if (await this.repositoryJobDetail.UpdateAsync(jobCardDetail,jobCardDetail.JobCardDetailId) != null)
                {
                    return jobCardDetail;
                    #region Mark
                        // JobCardMaster status will change manual
                        //if (jobCardDetail.JobCardMasterId != null)
                        //{
                        //    var jobCardMaster = await this.repositoryJobMaster.GetAsynvWithIncludes(jobCardDetail.JobCardMasterId.Value, "JobCardMasterId", Includes);

                        //    if (jobCardMaster != null)
                        //    {
                        //        if (!jobCardMaster.JobCardDetails.Any(x => x.JobCardDetailStatus == JobCardDetailStatus.Wait))
                        //            jobCardMaster.JobCardMasterStatus = JobCardMasterStatus.Complete;
                        //        else
                        //        {
                        //            if (jobCardMaster.JobCardMasterStatus == JobCardMasterStatus.Complete)
                        //                jobCardMaster.JobCardMasterStatus = JobCardMasterStatus.Wait;
                        //        }

                        //        jobCardMaster.ModifyDate = DateTime.Now;
                        //        jobCardMaster.Modifyer = Create;
                        //        await this.repositoryJobMaster.UpdateAsync(jobCardMaster, jobCardMaster.JobCardMasterId);
                        //    }
                        //}
                    #endregion
                }
            }

            return null;
        }
        private IEnumerable<DateTime> EachDay(DateTime from, DateTime thru)
        {
            for (var day = from.Date; day.Date <= thru.Date; day = day.AddDays(1))
                yield return day;
        }

        private IEnumerable<DateTime> EachCalendarDay(DateTime startDate, DateTime endDate)
        {
            for (var date = startDate.Date; date.Date <= endDate.Date; date = date.AddDays(1)) yield
            return date;
        }
        private async Task<string> GeneratedCode(int JobDetailId, int MachineId)
        {
            if (MachineId > 0 && MachineId > 0)
            {
                JobCardDetail jobDetail = await this.repositoryJobDetail.GetAsynvWithIncludes
                                                        (
                                                            JobDetailId,
                                                            "JobCardDetailId",
                                                            new List<string> { "JobCardMaster" }
                                                        );

                Machine machine = await this.repositoryMachine.GetAsync(MachineId);

                if (jobDetail != null && machine != null)
                {
                    var date = DateTime.Today;
                    var Runing = await this.repository.GetAllAsQueryable()
                                                      .CountAsync(x => x.CreateDate.Value.Year == date.Year) + 1;

                    return $"{jobDetail.JobCardMaster.JobCardMasterNo}_{machine.MachineCode}/{date.ToString("dd/MM/yy")}/{Runing.ToString("0000")}";
                }
            }

            return "xxxx/xx/xx_xx-xx/xx/xx/xx/xxxx";
        }

        private async Task<double> CalculatorManHour(TaskMachine taskMachine)
        {
            if (taskMachine != null)
            {
                if (taskMachine.ActualStartDate.HasValue && taskMachine.ActualEndDate.HasValue
                    && taskMachine.MachineId.HasValue)
                {
                    var Operator = await this.repositoryOperator.GetAllAsQueryable()
                                                .CountAsync(x => x.MachineId == taskMachine.MachineId);
                    Operator = Operator == 0 ? 1 : Operator;

                    double ManHour = 0;
                    int TotalDay = (taskMachine.ActualEndDate.Value.Date - taskMachine.ActualStartDate.Value.Date).Days;
                    TotalDay = TotalDay == 0 ? 1 : TotalDay;

                    // Day x Hour x Operator
                    ManHour = (TotalDay * 8) * Operator;

                    // OverTime
                    var OverTimes = await this.repositoryOverTime.GetAllAsQueryable()
                                                            .Where(x => x.TaskMachineId == taskMachine.TaskMachineId)
                                                            .ToListAsync();

                    if (OverTimes != null)
                    {
                        OverTimes.ForEach(item =>
                        {
                            ManHour += item.OverTimePerDate ?? 0;
                        });
                    }

                    return ManHour;
                }

            }

            return 0;
        }

        private async Task TaskMachineSendMailToEmpRequire(JobCardDetail jobCardDetail,TaskMachine taskMachine)
        {
            try
            {
                if (jobCardDetail.JobCardMaster != null)
                {
                    var user = await this.repositoryUser.GetAllAsQueryable()
                                        .Include(x => x.Employee)
                                        .Where(x => x.EmpCode == jobCardDetail.JobCardMaster.EmpWrite)
                                        .FirstOrDefaultAsync();
                    if (user != null)
                    {
                        if (!this.validEmail.IsValidEmail(user.MailAddress))
                            return;

                        var BodyMessage = "<body style=font-size:11pt;font-family:Tahoma>" +
                                            "<h4 style='color:steelblue;'>เมล์ฉบับนี้เป็นแจ้งเตือนจากระบบงาน VIPCO MACHINE SYSTEM</h4>" +
                                            $"เรียน คุณ{user.Employee.NameThai}" +
                                            $"<p>เรื่อง การเปิดใบงานเลขที่ {jobCardDetail.JobCardMaster.JobCardMasterNo} ได้รับการวางแผน</p>" +
                                            $"<p>ณ.ขณะนี้ ทางหน่วยงานแมชชีนได้ทำการวางแผนการทำงานในใบงานของแผนกแมชชีนเลขที่ {taskMachine.TaskMachineName}</p>" +
                                            $"<p>\"คุณ{user.Employee.NameThai}\" " +
                                            $"สามารถเข้าไปตรวจติดตามข้อมูลได้ <a href='http://{Request.Host}/task-machine/link-mail/{taskMachine.TaskMachineId}'>ที่นี้</a> </p>" +
                                            "<span style='color:steelblue;'>This mail auto generated by VIPCO MACHINE SYSTEM. Do not reply this email.</span>" +
                                          "</body>";

                        await this.SendMailMessage(user.MailAddress, user.Employee.NameThai,
                                                   new List<string> { user.MailAddress },
                                                   BodyMessage, "Notification mail from VIPCO MACHINE SYSTEM.");
                    }
                }
            }
            catch(Exception ex)
            {
                var message = $"Has error {ex.ToString()}";
            }
        }

        #endregion PrivateMenbers

        #region Constructor
        public TaskMachineController(
                IRepository<TaskMachine> repo,
                IRepository<NoTaskMachine> repoNo,
                IRepository<TaskMachineHasOverTime> repoOverTime,
                IRepository<Machine> repoMachine,
                IRepository<MachineHasOperator> repoOperator,
                IRepository<JobCardMaster> repoMaster,
                IRepository<JobCardDetail> repoDetail,
                IRepository<User> repoUser,
                IHostingEnvironment hosting,
                IMapper map)
        {
            this.repository = repo;
            this.repositoryNoTask = repoNo;
            this.repositoryOverTime = repoOverTime;
            this.repositoryJobMaster = repoMaster;
            this.repositoryJobDetail = repoDetail;
            this.repositoryMachine = repoMachine;
            this.repositoryOperator = repoOperator;
            this.repositoryUser = repoUser;
            this.hostingEnvironment = hosting;
            this.mapper = map;
            this.helpers = new HelpersClass<TaskMachine>();
            this.validEmail = new ValidEmail();
        }

        #endregion

        #region GET

        // GET: api/TaskMachine/
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var Includes = new List<string> { "Machine" , "JobCardDetail" , "Employee" };
            return new JsonResult(
                      this.ConverterTableToViewModel<TaskMachineViewModel, TaskMachine>(await this.repository.GetAllWithInclude2Async(Includes)),
                      this.DefaultJsonSettings);
            //return new JsonResult(await this.repository.GetAllAsync(), this.DefaultJsonSettings);
        }
       
        // GET: api/TaskMachine/5
        [HttpGet("{key}")]
        public async Task<IActionResult> Get(int key)
        {
            var Includes = new List<string> { "Machine", "JobCardDetail.CuttingPlan", "Employee" };
            return new JsonResult(
                      this.mapper.Map<TaskMachine, TaskMachineViewModel>(await this.repository.GetAsynvWithIncludes(key, "TaskMachineId", Includes)),
                      this.DefaultJsonSettings);
            // return new JsonResult(await this.repository.GetAsync(key), this.DefaultJsonSettings);
        }

        #region NoTaskMachine

        // GET: api/TaskMachine/NoTaskMachine
        [HttpGet("NoTaskMachine")]
        public async Task<IActionResult> GetNoTaskMachine()
        {
            var Includes = new List<string> { "Employee", "EmployeeGroup", "EmployeeGroupMIS"};
            return new JsonResult(
                      this.ConverterTableToViewModel<NoTaskMachineViewModel, NoTaskMachine>(await this.repositoryNoTask.GetAllWithInclude2Async(Includes)),
                      this.DefaultJsonSettings);
        }
        // GET: api/TaskMachine/NoTaskMachine/5
        [HttpGet("NoTaskMachine/{key}")]
        public async Task<IActionResult> GetNoTaskMachine(int key)
        {
            var Includes = new List<string> { "Employee", "EmployeeGroup" ,"EmployeeGroupMIS"};
            return new JsonResult(
                      this.mapper.Map<NoTaskMachine, NoTaskMachineViewModel>(await this.repositoryNoTask.GetAsynvWithIncludes(key, "NoTaskMachineId", Includes)),
                      this.DefaultJsonSettings);
            // return new JsonResult(await this.repository.GetAsync(key), this.DefaultJsonSettings);
        }

        #endregion

        // GET: api/TaskMachine/GetTaskMachineHasOverTime
        [HttpGet("GetTaskMachineHasOverTime/{key}")]
        public async Task<IActionResult> GetTaskMachineHasOverTime(int key)
        {
            var Includes = new List<string> { "TaskMachineHasOverTimes" };
            var taskMachine = await this.repository.GetAsynvWithIncludes(key, "TaskMachineId", Includes);

            return new JsonResult(new { Result = taskMachine.TaskMachineHasOverTimes.Any() }, this.DefaultJsonSettings);
        }

        [HttpGet("GetWorkGroup")]
        public async Task<IActionResult> GetWorkGroupOfJobCardMaster()
        {
            var QueryData = await this.repositoryJobMaster.GetAllAsQueryable()
                                                            .Where(x => x.JobCardMasterStatus != JobCardMasterStatus.Cancel)
                                                            .Include(x => x.EmployeeGroup)
                                                            .GroupBy(x => x.EmployeeGroup)
                                                            .Select(x => x.Key)
                                                            .ToListAsync();
            if (QueryData.Any())
            {
                return new JsonResult(QueryData, this.DefaultJsonSettings);
            }
            return NotFound(new { Error = "Not found workgroup." });
        }

        #endregion

        #region POST
        // POST: api/TaskMachine/CheckMachineTime
        [HttpPost("CheckMachineTime")]
        public async Task<IActionResult> CheclMachineTime([FromBody] TaskMachine taskMachine)
        {
            var Message = "Not found data";

            try
            {
                if (taskMachine != null)
                {
                    if (taskMachine.PlannedStartDate != null &&
                        taskMachine.PlannedEndDate != null &&
                        taskMachine.MachineId != null)
                    {

                        taskMachine.PlannedStartDate = taskMachine.PlannedStartDate.AddHours(7);
                        taskMachine.PlannedEndDate = taskMachine.PlannedEndDate.AddHours(7);

                        var AnyData = await this.repository.GetAllAsQueryable()
                                                    .AnyAsync(x => (x.TaskMachineStatus == TaskMachineStatus.Wait ||
                                                                x.TaskMachineStatus == TaskMachineStatus.Process) &&
                                                                x.MachineId == taskMachine.MachineId &&
                                                                x.TaskMachineId != taskMachine.TaskMachineId &&
                                                                taskMachine.PlannedStartDate.Date <= x.PlannedEndDate.Date &&
                                                                taskMachine.PlannedEndDate.Date >= x.PlannedStartDate.Date);

                        return new JsonResult(new { AnyData = AnyData }, this.DefaultJsonSettings);
                    }
                }
            }
            catch(Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }

            return NotFound(new { Error = Message });
        }

        // POST: api/TaskMachine/TaskMachineWaitAndProcess
        [HttpPost("TaskMachineWaitAndProcess")]
        public async Task<IActionResult> TaskMachineWaitAndProcess([FromBody] OptionScheduleViewModel Scehdule)
        {
            string Message = "";

            try
            {
                var QueryData = this.repository.GetAllAsQueryable()
                                               .Include(x => x.Machine)
                                               .Include(x => x.JobCardDetail.JobCardMaster.ProjectCodeDetail.ProjectCodeMaster)
                                               .Include(x => x.JobCardDetail.CuttingPlan)
                                               .AsQueryable();
                int TotalRow;

                if (Scehdule != null)
                {
                    if (Scehdule.TaskMachineId.HasValue)
                        QueryData = QueryData.Where(x => x.TaskMachineId == Scehdule.TaskMachineId);

                    if (!string.IsNullOrEmpty(Scehdule.Filter))
                    {
                        var filters = string.IsNullOrEmpty(Scehdule.Filter) ? new string[] { "" }
                                   : Scehdule.Filter.ToLower().Split(null);
                        foreach (var keyword in filters)
                        {
                            QueryData = QueryData.Where(x => x.JobCardDetail.CuttingPlan.CuttingPlanNo.ToLower().Trim().Contains(keyword.ToLower()) ||
                                                             x.JobCardDetail.CuttingPlan.MaterialSize.ToLower().Trim().Contains(keyword.ToLower()));
                        }
                    }

                    // Option Create
                    if (!string.IsNullOrEmpty(Scehdule.Creator))
                    {
                        QueryData = QueryData.Where(x =>
                            x.JobCardDetail.JobCardMaster.EmpWrite == Scehdule.Creator);
                    }

                    // Option Require
                    if (!string.IsNullOrEmpty(Scehdule.Require))
                    {
                        QueryData = QueryData.Where(x =>
                            x.JobCardDetail.JobCardMaster.GroupCode == Scehdule.Require);
                    }

                    // Option JobNo
                    if (Scehdule.JobNo.HasValue)
                    {
                        QueryData = QueryData.Where(x =>
                            x.JobCardDetail.JobCardMaster.ProjectCodeDetail.ProjectCodeMasterId == Scehdule.JobNo);
                    }
                    // Option Level
                    if (Scehdule.Level2.HasValue)
                    {
                        QueryData = QueryData.Where(x =>
                            x.JobCardDetail.JobCardMaster.ProjectCodeDetail.ProjectCodeDetailId == Scehdule.Level2);
                    }
                    // Option TypeMachineId
                    if (Scehdule.TypeMachineId.HasValue)
                    {
                        QueryData = QueryData.Where(x =>
                            x.Machine.TypeMachineId == Scehdule.TypeMachineId);
                    }
                    // Option Mode
                    if (Scehdule.Mode != null)
                    {
                        if (Scehdule.Mode == 2)
                            QueryData = QueryData.Where(x => x.TaskMachineStatus == TaskMachineStatus.Wait ||
                                                             x.TaskMachineStatus == TaskMachineStatus.Process);
                    }
                    // Set order planned end date 
                    QueryData = QueryData.OrderByDescending(x => x.PlannedStartDate);

                    TotalRow = await QueryData.CountAsync();

                    // Option Skip and Task
                    // if (Scehdule.Skip.HasValue && Scehdule.Take.HasValue)
                    QueryData = QueryData.Skip(Scehdule.Skip ?? 0).Take(Scehdule.Take ?? 5);
                }
                else
                {
                    TotalRow = await QueryData.CountAsync();
                }

                var GetData = await QueryData.ToListAsync();
                if (GetData.Any())
                {
                    IDictionary<string, int> ColumnGroupTop = new Dictionary<string, int>();
                    IDictionary<DateTime, string> ColumnGroupBtm = new Dictionary<DateTime, string>();
                    List<string> ColumnsAll = new List<string>();
                    DateTime MinDate; DateTime MaxDate;
                    // Min
                    if (GetData.Any(x => x.ActualStartDate != null))
                        MinDate = GetData.Min(x => x.PlannedStartDate.Date) < GetData.Where(x => x.ActualStartDate != null).Min(x => x?.ActualStartDate?.Date ?? x.PlannedStartDate.Date) ?
                                    GetData.Min(x => x.PlannedStartDate.Date) : GetData.Where(x => x.ActualStartDate != null).Min(x => x?.ActualStartDate?.Date ?? x.PlannedStartDate.Date);
                    else
                        MinDate = GetData.Min(x => x.PlannedStartDate);
                    // Max
                    if (GetData.Any(x => x.ActualEndDate != null))
                        MaxDate = GetData.Max(x => x.PlannedEndDate.Date) > GetData.Where(x => x.ActualEndDate != null).Max(x => x?.ActualEndDate?.Date ?? x.PlannedEndDate.Date) ?
                                    GetData.Max(x => x.PlannedEndDate.Date) : GetData.Max(x => x?.ActualEndDate?.Date ?? x.PlannedEndDate.Date);
                    else
                        MaxDate = GetData.Max(x => x.PlannedEndDate);

                    if (MinDate == null && MaxDate == null)
                    {
                        return NotFound(new { Error = "Data not found" });
                    }

                    int countCol = 1;
                    // add Date to max
                    MaxDate = MaxDate.AddDays(2);
                    MinDate = MinDate.AddDays(-2);
                    foreach (DateTime day in EachDay(MinDate, MaxDate))
                    {
                        // Get Month
                        if (ColumnGroupTop.Any(x => x.Key == day.ToString("MMMM")))
                            ColumnGroupTop[day.ToString("MMMM")] += 1;
                        else
                        {
                            ColumnGroupTop.Add(day.ToString("MMMM"), 1);
                        }

                        ColumnGroupBtm.Add(day.Date, $"Col{countCol.ToString("00")}");
                        countCol++;
                    }

                    var DataTable = new List<IDictionary<String, Object>>();
                    // OrderBy(x => x.Machine.TypeMachineId).ThenBy(x => x.Machine.MachineCode)
                    foreach (var Data in GetData.OrderBy(x => x.PlannedStartDate).ThenBy(x => x.PlannedEndDate))
                    {
                        IDictionary<String, Object> rowData = new ExpandoObject();
                        var Pro = Data.CurrentQuantity ?? 0;
                        var Qty = Data.TotalQuantity ?? 0;
                        var JobNo = $"{Data?.JobCardDetail?.JobCardMaster?.ProjectCodeDetail?.ProjectCodeMaster.ProjectCode ?? "-"}/{Data?.JobCardDetail?.JobCardMaster?.ProjectCodeDetail?.ProjectCodeDetailCode ?? "-"}";
                        // add column time
                        rowData.Add("MachineNo", Data?.Machine?.MachineCode ?? "-");
                        rowData.Add("JobNo", JobNo);
                        rowData.Add("CT/SD", Data?.JobCardDetail?.CuttingPlan?.CuttingPlanNo +
                            (string.IsNullOrEmpty(Data?.JobCardDetail?.Material.Trim()) ? "" : $" | {Data?.JobCardDetail?.Material.Trim()}" ) +
                            (Data?.JobCardDetail?.UnitNo == null ? "" : $" | UnitNo.{Data?.JobCardDetail?.UnitNo}"));
                        rowData.Add("Qty", Qty);
                        rowData.Add("Pro", Pro);
                        rowData.Add("Progess", Math.Round(((double)(Pro * 100) / Qty), 1) + "%");
                        rowData.Add("TaskMachineId", Data?.TaskMachineId ?? 1);

                        // Data is 1:Plan,2:Actual,3:PlanAndActual
                        // For Plan
                        if (Data.PlannedStartDate != null && Data.PlannedEndDate != null)
                        {
                            foreach (DateTime day in EachDay(Data.PlannedStartDate, Data.PlannedEndDate))
                            {
                                if (ColumnGroupBtm.Any(x => x.Key == day.Date))
                                    rowData.Add(ColumnGroupBtm.FirstOrDefault(x => x.Key == day.Date).Value, 1);
                            }
                        }
                        //For Actual
                        if (Data.ActualStartDate != null)
                        {
                            var EndDate = Data.ActualEndDate ?? (MaxDate > DateTime.Today ? DateTime.Today : MaxDate);

                            foreach (DateTime day in EachDay(Data.ActualStartDate.Value, EndDate))
                            {
                                if (ColumnGroupBtm.Any(x => x.Key == day.Date))
                                {

                                    var Col = ColumnGroupBtm.FirstOrDefault(x => x.Key == day.Date);

                                    // if Have Plan change value to 3
                                    if (rowData.Keys.Any(x => x == Col.Value))
                                        rowData[Col.Value] = 3;
                                    else // else Don't have plan value is 2
                                        rowData.Add(Col.Value, 2);
                                }
                            }
                        }

                        DataTable.Add(rowData);
                    }

                    if (DataTable.Any())
                        ColumnGroupBtm.OrderBy(x => x.Key.Date).Select(x => x.Value)
                            .ToList().ForEach(item => ColumnsAll.Add(item));

                    return new JsonResult(new
                    {
                        TotalRow = TotalRow,
                        ColumnsTop = ColumnGroupTop.Select(x => new
                        {
                            Name = x.Key,
                            Value = x.Value
                        }),
                        ColumnsLow = ColumnGroupBtm.OrderBy(x => x.Key.Date).Select(x => x.Key.Day),
                        ColumnsAll = ColumnsAll,
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

        // POST: api/TaskMachine/GetScroll
        [HttpPost("GetScroll")]
        public async Task<IActionResult> GetScroll([FromBody] ScrollViewModel Scroll)
        {
            var Message = "";
            try
            {
                var QueryData = this.repository.GetAllAsQueryable()
                                    .Include(x => x.Machine)
                                    .Include(x => x.Employee)
                                    .Include(x => x.JobCardDetail.CuttingPlan)
                                    .AsQueryable();

                if (!string.IsNullOrEmpty(Scroll.Where))
                {
                    QueryData = QueryData.Where(x => x.Creator == Scroll.Where);
                }

                // Filter
                var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                    : Scroll.Filter.ToLower().Split(null);
                foreach (var keyword in filters)
                {
                    QueryData = QueryData.Where(x => x.Description.ToLower().Contains(keyword) ||
                                                     x.TaskMachineName.ToLower().Contains(keyword) ||
                                                     x.JobCardDetail.CuttingPlan.CuttingPlanNo.ToLower().Contains(keyword) ||
                                                     x.Machine.MachineCode.ToLower().Contains(keyword));
                }

                // Order
                switch (Scroll.SortField)
                {
                    case "MachineCode":
                        if (Scroll.SortOrder == -1)
                            QueryData = QueryData.OrderByDescending(e => e.Machine.MachineCode);
                        else
                            QueryData = QueryData.OrderBy(e => e.Machine.MachineCode);
                        break;

                    case "CuttingPlanNo":
                        if (Scroll.SortOrder == -1)
                            QueryData = QueryData.OrderByDescending(e => e.JobCardDetail.CuttingPlan.CuttingPlanNo);
                        else
                            QueryData = QueryData.OrderBy(e => e.JobCardDetail.CuttingPlan.CuttingPlanNo);
                        break;
                    case "TaskMachineName":
                        if (Scroll.SortOrder == -1)
                            QueryData = QueryData.OrderByDescending(e => e.TaskMachineName);
                        else
                            QueryData = QueryData.OrderBy(e => e.TaskMachineName);
                        break;

                    default:
                        QueryData = QueryData.OrderByDescending(e => e.PlannedStartDate);
                        break;
                }

                QueryData = QueryData.Skip(Scroll.Skip ?? 0).Take(Scroll.Take ?? 50);

                return new JsonResult(new ScrollDataViewModel<TaskMachine>
                        (Scroll,
                        this.ConverterTableToViewModel<TaskMachineViewModel,TaskMachine>(await QueryData.AsNoTracking().ToListAsync())),
                        this.DefaultJsonSettings);
            }
            catch (Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }
            return NotFound(new { Error = Message });
        }

        // POST: api/TaskMachine/GetScroll
        [HttpPost("GetScrollNoTaskMachine")]
        public async Task<IActionResult> GetScrollNoTaskMachine([FromBody] ScrollViewModel Scroll)
        {
            var Message = "";
            try
            {
                var QueryData = this.repositoryNoTask.GetAllAsQueryable()
                                    .Include(x => x.EmployeeGroup)
                                    .Include(x => x.JobCardDetail.CuttingPlan)
                                    .AsQueryable();

                if (!string.IsNullOrEmpty(Scroll.Where))
                {
                    QueryData = QueryData.Where(x => x.Creator == Scroll.Where);
                }

                // Filter
                var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                    : Scroll.Filter.ToLower().Split(null);
                foreach (var keyword in filters)
                {
                    QueryData = QueryData.Where(x => x.Description.ToLower().Contains(keyword) ||
                                                     x.JobCardDetail.CuttingPlan.CuttingPlanNo.ToLower().Contains(keyword) ||
                                                     x.EmployeeGroup.Description.ToLower().Contains(keyword));
                }

                // Order
                switch (Scroll.SortField)
                {
                    case "NoTaskMachineCode":
                        if (Scroll.SortOrder == -1)
                            QueryData = QueryData.OrderByDescending(e => e.NoTaskMachineCode);
                        else
                            QueryData = QueryData.OrderBy(e => e.NoTaskMachineCode);
                        break;

                    case "CuttingPlanNo":
                        if (Scroll.SortOrder == -1)
                            QueryData = QueryData.OrderByDescending(e => e.JobCardDetail.CuttingPlan.CuttingPlanNo);
                        else
                            QueryData = QueryData.OrderBy(e => e.JobCardDetail.CuttingPlan.CuttingPlanNo);
                        break;

                    case "GroupCodeString":
                        if (Scroll.SortOrder == -1)
                            QueryData = QueryData.OrderByDescending(e => e.EmployeeGroup.Description);
                        else
                            QueryData = QueryData.OrderBy(e => e.EmployeeGroup.Description);
                        break;

                    default:
                        QueryData = QueryData.OrderByDescending(e => e.Date);
                        break;
                }

                QueryData = QueryData.Skip(Scroll.Skip ?? 0).Take(Scroll.Take ?? 50);

                return new JsonResult(new ScrollDataViewModel<NoTaskMachineViewModel>
                        (Scroll,
                        this.ConverterTableToViewModel<NoTaskMachineViewModel, NoTaskMachine>(await QueryData.AsNoTracking().ToListAsync())),
                        this.DefaultJsonSettings);
            }
            catch (Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }
            return NotFound(new { Error = Message });
        }

        // POST: api/TaskMachine
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]TaskMachine nTaskMachine)
        {
            if (nTaskMachine != null)
            {
                JobCardDetail jobCardDetail = null;
                nTaskMachine.TaskMachineName = await this.GeneratedCode(nTaskMachine.JobCardDetailId, nTaskMachine.MachineId ?? 0);
                // add hour to DateTime to set Asia/Bangkok
                nTaskMachine = helpers.AddHourMethod(nTaskMachine);

                nTaskMachine.CreateDate = DateTime.Now;
                nTaskMachine.Creator = nTaskMachine.Creator ?? "Someone";

                if (nTaskMachine.JobCardDetail != null)
                    nTaskMachine.JobCardDetail = null;

                // Check TaskMachineStatus
                if (nTaskMachine.ActualStartDate.HasValue && nTaskMachine.ActualEndDate.HasValue)
                    nTaskMachine.TaskMachineStatus = TaskMachineStatus.Complate;
                else if (nTaskMachine.ActualStartDate.HasValue && !nTaskMachine.ActualEndDate.HasValue)
                    nTaskMachine.TaskMachineStatus = TaskMachineStatus.Process;

                var helperEdit = new HelpersClass<TaskMachineHasOverTime>();

                if (nTaskMachine.TaskMachineHasOverTimes != null)
                {
                    foreach (var nDetail in nTaskMachine.TaskMachineHasOverTimes)
                    {
                        var tempDetail = helperEdit.AddHourMethod(nDetail);
                        //Update date
                        nDetail.OverTimeDate = tempDetail.OverTimeDate;
                        //Set Create
                        nDetail.CreateDate = nTaskMachine.CreateDate;
                        nDetail.Creator = nTaskMachine.Creator;
                    }
                }

                var InsertComplate = await this.repository.AddAsync(nTaskMachine);
                if (InsertComplate != null)
                {
                    if (InsertComplate.JobCardDetailId > 0)
                    {
                        jobCardDetail = await this.UpdateJobCard(InsertComplate.JobCardDetailId, InsertComplate.Creator);
                    }
                }

                if (InsertComplate.TaskMachineStatus == TaskMachineStatus.Complate)
                {
                    InsertComplate.ActualManHours = await this.CalculatorManHour(InsertComplate);
                    await this.repository.UpdateAsync(InsertComplate, InsertComplate.TaskMachineId);
                }

                // Send Mail
                if (jobCardDetail != null)
                    await this.TaskMachineSendMailToEmpRequire(jobCardDetail,InsertComplate);

                return new JsonResult(InsertComplate, this.DefaultJsonSettings);
            }

            return NotFound(new { Error = "TaskMachine not found. " });
        }

        // POST: api/TaskMachine/NoTaskMachine
        [HttpPost("NoTaskMachine")]
        public async Task<IActionResult> PostNoTaskMachine([FromBody] NoTaskMachine nNoTaskMachine)
        {
            var Message = "No Data";
            if (nNoTaskMachine != null)
            {
                nNoTaskMachine.NoTaskMachineCode = DateTime.Now.ToString("ddMMyyhhmm");
                // No task
                nNoTaskMachine.CreateDate = DateTime.Now;
                nNoTaskMachine.Creator = nNoTaskMachine.Creator ?? "Someone";

                var helpersNo = new HelpersClass<NoTaskMachine>();
                nNoTaskMachine = helpersNo.AddHourMethod(nNoTaskMachine);

                var InsertComplate = await this.repositoryNoTask.AddAsync(nNoTaskMachine);
                if (InsertComplate != null)
                {
                    if (InsertComplate.JobCardDetailId > 0)
                        await this.UpdateJobCard(InsertComplate.JobCardDetailId, InsertComplate.Creator);

                    return new JsonResult(InsertComplate, this.DefaultJsonSettings);
                }
            }
            return NotFound(new { Error = Message });
        }

        #endregion

        #region PUT
        // PUT: api/TaskMachine/5
        [HttpPut("{key}")]
        public async Task<IActionResult> PutByNumber(int key, [FromBody]TaskMachine uTaskMachine)
        {
            if (uTaskMachine != null)
            {
                // add hour to DateTime to set Asia/Bangkok
                uTaskMachine = helpers.AddHourMethod(uTaskMachine);

                uTaskMachine.ModifyDate = DateTime.Now;
                uTaskMachine.Modifyer = uTaskMachine.Modifyer ?? "Someone";
                // Check TaskMachineStatus
                if (uTaskMachine.ActualStartDate.HasValue && uTaskMachine.ActualEndDate.HasValue)
                    uTaskMachine.TaskMachineStatus = TaskMachineStatus.Complate;
                else if (uTaskMachine.ActualStartDate.HasValue && !uTaskMachine.ActualEndDate.HasValue)
                    uTaskMachine.TaskMachineStatus = TaskMachineStatus.Process;

                var helperEdit = new HelpersClass<TaskMachineHasOverTime>();

                if (uTaskMachine.TaskMachineHasOverTimes != null)
                {
                    foreach (var overTime in uTaskMachine.TaskMachineHasOverTimes)
                    {
                        var tempDetail = helperEdit.AddHourMethod(overTime);
                        //Update date
                        overTime.OverTimeDate = tempDetail.OverTimeDate;

                        if (overTime.OverTimeId > 0)
                        {
                            //ModifyDate
                            overTime.ModifyDate = uTaskMachine.ModifyDate;
                            overTime.Modifyer = uTaskMachine.Modifyer;
                        }
                        else
                        {
                            overTime.CreateDate = uTaskMachine.ModifyDate;
                            overTime.Creator = uTaskMachine.Modifyer;
                        }
                    }
                }
                var beforUpdate = await this.repository.GetAsync(key);
                if (beforUpdate != null)
                {
                    if (beforUpdate.JobCardDetailId > 0 && uTaskMachine.JobCardDetailId > 0)
                    {
                        if (beforUpdate.JobCardDetailId != uTaskMachine.JobCardDetailId)
                        {
                            await this.UpdateJobCard(beforUpdate.JobCardDetailId, uTaskMachine.Modifyer,JobCardDetailStatus.Wait);
                        }
                    }
                }

                // update Master not update Detail it need to update Detail directly
                var updateComplate = await this.repository.UpdateAsync(uTaskMachine, key);

                if (updateComplate != null)
                {
                    if (updateComplate.JobCardDetailId > 0)
                    {
                        await this.UpdateJobCard(updateComplate.JobCardDetailId, updateComplate.Modifyer);
                    }

                    // filter
                    Expression<Func<TaskMachineHasOverTime, bool>> condition = m => m.TaskMachineId == key;
                    var dbOvertimes = this.repositoryOverTime.FindAll(condition);

                    //Remove TaskMachineHasOverTime if edit remove it
                    foreach (var dbOvertime in dbOvertimes)
                    {
                        if (!uTaskMachine.TaskMachineHasOverTimes.Any(x => x.OverTimeId == dbOvertime.OverTimeId))
                            await this.repositoryOverTime.DeleteAsync(dbOvertime.OverTimeId);
                    }
                    //Update ProjectCodeDetails
                    foreach (var uOvertime in uTaskMachine.TaskMachineHasOverTimes)
                    {
                        if (uOvertime.OverTimeId > 0)
                            await this.repositoryOverTime.UpdateAsync(uOvertime, uOvertime.OverTimeId);
                        else
                        {
                            if (uOvertime.TaskMachineId < 1)
                                uOvertime.TaskMachineId = uTaskMachine.TaskMachineId;

                            await this.repositoryOverTime.AddAsync(uOvertime);
                        }
                    }

                    if (updateComplate.TaskMachineStatus == TaskMachineStatus.Complate)
                    {
                        updateComplate.ActualManHours = await this.CalculatorManHour(updateComplate);
                        await this.repository.UpdateAsync(updateComplate, updateComplate.TaskMachineId);
                    }
                }
                return new JsonResult(updateComplate, this.DefaultJsonSettings);
                //return new JsonResult(await this.repository.UpdateAsync(uTaskMachine, key), this.DefaultJsonSettings);
            }
            return NotFound(new { Error = "TaskMachine not found. " });
        }

        // PUT: api/TaskMachine/NoTaskMachine/5
        [HttpPut("NoTaskMachine/{key}")]
        public async Task<IActionResult> NoTaskMachinePutByNumber(int key, [FromBody] NoTaskMachine uNoTaskMachine)
        {
            var Message = "No Data.";
            if (uNoTaskMachine != null)
            {
                var helpersNo = new HelpersClass<NoTaskMachine>();
                uNoTaskMachine = helpersNo.AddHourMethod(uNoTaskMachine);

                uNoTaskMachine.ModifyDate = DateTime.Now;
                uNoTaskMachine.Modifyer = uNoTaskMachine.Modifyer ?? "Someone";

                var UpdateComplate = await this.repositoryNoTask.UpdateAsync(uNoTaskMachine,key);
                if (UpdateComplate != null)
                {
                    if (UpdateComplate.JobCardDetailId > 0)
                        await this.UpdateJobCard(UpdateComplate.JobCardDetailId, UpdateComplate.Modifyer);

                    return new JsonResult(UpdateComplate, this.DefaultJsonSettings);
                }
            }
            return NotFound(new { Error = Message });
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

        #region TEST

        private IActionResult TestScheduler()
        {
            return NotFound(new { Error = "" });
        }

        #endregion

        #region REPORT

        [HttpGet("GetReportTaskMachine/{TaskMachineId}")]
        public async Task<IActionResult> GetReportTaskMachine(int TaskMachineId)
        {
            var Message = "Not found TaskMachineId";
            try
            {
                if (TaskMachineId > 0)
                {
                    var Includes = new List<string> { "JobCardDetail.CuttingPlan", "Employee" };
                    var paper = await this.repository.GetAsynvWithIncludes(TaskMachineId, "TaskMachineId", Includes);
                    if (paper != null)
                    {
                        Includes = new List<string> { "ProjectCodeDetail.ProjectCodeMaster","EmployeeRequire","EmployeeWrite","JobCardMasterHasAttachs" };
                        var jobMaster = await this.repositoryJobMaster.GetAsynvWithIncludes(paper?.JobCardDetail?.JobCardMasterId ?? 0, "JobCardMasterId", Includes);
                        if (jobMaster != null)
                        {
                            var JobNo = "-";
                            var Level23 = "-";
                            if (jobMaster?.ProjectCodeDetail != null)
                            {
                                if (jobMaster?.ProjectCodeDetail?.ProjectCodeMaster != null)
                                {
                                    JobNo = $"{jobMaster.ProjectCodeDetail.ProjectCodeMaster.ProjectCode}";
                                    Level23 = $"{jobMaster.ProjectCodeDetail.ProjectCodeDetailCode}";
                                }
                            }

                            var onePage = new OnePage()
                            {
                                TemplateFolder = this.hostingEnvironment.WebRootPath + "\\reports\\"
                            };//general class for work

                            var PaperModel = new PaperTaskMachine()
                            {
                                Actual = paper.ActualStartDate == null ? "-" : (paper.ActualStartDate.Value.ToString("dd/MM/yy") + "  ถึง  " +
                                         (paper.ActualEndDate == null ? "-" : paper.ActualEndDate.Value.ToString("dd/MM/yy"))),
                                CreateBy = jobMaster?.EmployeeWrite.NameThai ?? "-",
                                DueDate = jobMaster.DueDate == null ? "-" : jobMaster.DueDate.Value.ToString("dd/MM/yy"),
                                DateRequired = jobMaster.JobCardDate == null ? "-" : jobMaster.JobCardDate.Value.ToString("dd/MM/yy"),
                                Employee1 = "-",
                                Employee2 = "-",
                                Employee3 = "-",
                                Employee4 = "-",
                                Level23 = Level23,
                                JobNo = JobNo,
                                Mate1 = paper?.JobCardDetail?.Material ?? "-",
                                Plan = paper.PlannedStartDate.ToString("dd/MM/yy") + "  ถึง  " + paper.PlannedEndDate.ToString("dd/MM/yy"),
                                Recevied = jobMaster?.EmployeeRequire?.NameThai ?? "-",
                                Remark = paper?.Description ?? "-",
                                ShopDrawing = paper?.JobCardDetail?.CuttingPlan?.CuttingPlanNo ?? "-",
                                TaskMachineNo = paper?.TaskMachineName ?? "",
                                TotalAttach = jobMaster?.JobCardMasterHasAttachs?.Count() > 0 ? jobMaster.JobCardMasterHasAttachs.Count().ToString("00") : "-",
                            };

                            Includes = new List<string>() { "TypeMachine", "MachineHasOperators.Employee" };
                            var machine = await this.repositoryMachine.GetAsynvWithIncludes(paper?.MachineId ?? 0, "MachineId", Includes);
                            if (machine != null)
                            {
                                PaperModel.MachineNo = machine?.MachineCode ?? "-";
                                PaperModel.TypeMachine = machine?.TypeMachine?.TypeMachineCode ?? "-";

                                int row = 1;
                                foreach (var emp in machine.MachineHasOperators)
                                {
                                    switch (row)
                                    {
                                        case 1:
                                            PaperModel.Employee1 = emp.Employee.NameThai;
                                            break;
                                        case 2:
                                            PaperModel.Employee2 = emp.Employee.NameThai;
                                            break;
                                        case 3:
                                            PaperModel.Employee3 = emp.Employee.NameThai;
                                            break;
                                        case 4:
                                            PaperModel.Employee4 = emp.Employee.NameThai;
                                            break;
                                        default:
                                            break;
                                    }
                                    row++;
                                }
                            }


                            var stream = onePage.Export<PaperTaskMachine>(PaperModel, "PaperTaskMachine2");

                            stream.Seek(0, SeekOrigin.Begin);
                            // "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Reports.xlsx"
                            // "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "Reports.docx"
                            return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Reports.xlsx");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }

            return NotFound(new { Error = Message });
        }

        [HttpGet("GetReportTaskMachineOverTime/{TaskMachineId}")]
        public async Task<IActionResult> GetReportTaskMachineOverTime(int TaskMachineId)
        {
            var Message = "Not found TaskMachineId";
            try
            {
                if (TaskMachineId > 0)
                {
                    var Includes = new List<string> {"TaskMachineHasOverTimes.Employee","Machine" };
                    var taskMachine = await this.repository.GetAsynvWithIncludes(TaskMachineId, "TaskMachineId", Includes);

                    if (taskMachine != null)
                    {
                        var overTimes = new List<PaperTaskMachineOverTime>();

                        foreach (var item in taskMachine.TaskMachineHasOverTimes.OrderBy(x => x.OverTimeDate))
                        {
                            if (item.OverTimeDate == null)
                                continue;

                            var Stime = new TimeSpan();
                            var Etime = new TimeSpan();

                            if (item.OverTimeDate.Value.DayOfWeek == DayOfWeek.Sunday)
                            {
                                Stime = new TimeSpan(8, 0, 0);
                                Etime = new TimeSpan((int)(item.OverTimePerDate ?? 0) + 9, 0, 0);
                            }
                            else
                            {
                                Stime = new TimeSpan(17, 0, 0);
                                Etime = new TimeSpan((int)(item.OverTimePerDate ?? 0) + 17, 0, 0);
                            }

                            overTimes.Add(new PaperTaskMachineOverTime()
                            {
                                DateOverTime = (item.OverTimeDate.Value.Date + Stime).ToString("dd/MM/yy HH:mm") + " ถึง " + Etime.ToString(@"hh\:mm"),
                                EmpCode = item.EmpCode ?? "-",
                                EmpName = item?.Employee?.NameThai ?? "-",
                                Remark = string.IsNullOrEmpty(item.Description) ? "-" : item.Description.Trim(),
                                Row = (overTimes.Count() + 1).ToString("00")
                            });
                        }

                        if (overTimes.Any())
                        {
                            var worker = new Worker()
                            {
                                TemplateFolder = this.hostingEnvironment.WebRootPath + "\\reports\\",
                            };

                            var creDataTable = new MyDataTable();
                            var dataTable = creDataTable.CreateMyDataTable<PaperTaskMachineOverTime>(overTimes);

                            Dictionary<string, string> DicLabel = new Dictionary<string, string>()
                            {
                                { "TaskMachineNo", taskMachine?.TaskMachineName ?? "-" },
                                { "MachineNo", taskMachine?.Machine?.MachineCode ?? "-" },
                            };

                            var stream = worker.Export(dataTable, DicLabel, "TaskMachineOverTime");
                            stream.Seek(0, SeekOrigin.Begin);
                            // "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Reports.xlsx"
                            // "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "Reports.docx"
                            return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Reports.xlsx");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }

            return NotFound(new { Error = Message });
        }
        #endregion

        #region MAIL

        private async Task SendMailMessage(string MailFrom,string NameFrom,List<string> MailTos,string Message,string Subject)
        {
            try
            {
                SmtpClient client = new SmtpClient("mail.vipco-thai.com", 25)
                {
                    UseDefaultCredentials = false,
                    EnableSsl = false,
                    // vipco-thai no need Credential
                    // Credentials = new NetworkCredential("username", "password")
                };

                MailMessage mailMessage = new MailMessage
                {
                    From = new MailAddress(MailFrom, NameFrom),
                    IsBodyHtml = true,
                    Body = Message,
                    Subject = Subject,
                };
                // Add MailAddress To
                MailTos.ForEach(item => mailMessage.To.Add(item));
                await client.SendMailAsync(mailMessage);
            }catch(Exception ex)
            {
                var message = $"Has error {ex.ToString()}";
            }

        }

        #endregion
    }
}
