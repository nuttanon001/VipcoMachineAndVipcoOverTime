using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using VipcoMachine.Helpers;
using VipcoMachine.Models;
using VipcoMachine.Services.Interfaces;
using VipcoMachine.ViewModels;

namespace VipcoMachine.Controllers
{
    [Produces("application/json")]
    [Route("api/JobCardMaster")]
    public class JobCardMasterController : Controller
    {
        #region PrivateMenbers

        private IRepository<JobCardMaster> repository;
        private IRepository<JobCardMasterHasAttach> repositoryHasAttach;
        private IRepository<JobCardDetail> repositoryDetail;
        private IRepository<UnitsMeasure> repositoryUom;
        private IRepository<CuttingPlan> repositoryCut;
        private IRepository<AttachFile> repositoryAtt;
        private IRepository<ProjectCodeDetail> repositoryProDetail;
        private IRepository<TypeMachine> repositoryTypeMachine;
        private IMapper mapper;
        private IHostingEnvironment appEnvironment;
        private HelpersClass<JobCardMaster> helpers;

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

        private async Task<string> GeneratedCode(int ProjectDetailId,int TypeMachineId)
        {
            if (ProjectDetailId > 0 && TypeMachineId > 0)
            {
                ProjectCodeDetail proDetail = await this.repositoryProDetail.GetAsynvWithIncludes
                                                        (
                                                            ProjectDetailId,
                                                            "ProjectCodeDetailId",
                                                            new List<string> { "ProjectCodeMaster" }
                                                        );

                TypeMachine typeMachine = await this.repositoryTypeMachine.GetAsync(TypeMachineId);

                if (proDetail != null && typeMachine != null)
                {
                    var Runing = await this.repository.GetAllAsQueryable()
                                                      .CountAsync(x => x.ProjectCodeDetail.ProjectCodeMasterId == proDetail.ProjectCodeMasterId &&
                                                                       x.TypeMachineId == TypeMachineId) + 1;

                    return $"{proDetail.ProjectCodeMaster.ProjectCode}/{typeMachine.TypeMachineCode}/{Runing.ToString("0000")}";
                }
            }

            return "xxxx/xx/xx";
        }

        #endregion PrivateMenbers

        #region Constructor

        public JobCardMasterController(
            IRepository<JobCardMaster> repo,
            IRepository<JobCardMasterHasAttach> repoHasAttach,
            IRepository<JobCardDetail> repoDetail,
            IRepository<TypeMachine> repoTypeMac,
            IRepository<ProjectCodeDetail> repoProDetail,
            IRepository<UnitsMeasure> repoUom,
            IRepository<CuttingPlan> repoCut,
            IRepository<AttachFile> repoAtt,
            IMapper map,
            IHostingEnvironment app)
        {
            this.repository = repo;
            this.repositoryHasAttach = repoHasAttach;
            this.repositoryDetail = repoDetail;
            this.repositoryTypeMachine = repoTypeMac;
            this.repositoryProDetail = repoProDetail;
            this.repositoryUom = repoUom;
            this.repositoryCut = repoCut;
            this.repositoryAtt = repoAtt;
            this.appEnvironment = app;
            this.mapper = map;
            this.helpers = new HelpersClass<JobCardMaster>();
        }

        #endregion Constructor

        #region GET

        // GET: api/JobCardMaster/
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            //return new JsonResult(await this.repository.GetAllAsync(), this.DefaultJsonSettings);
            var Includes = new List<string> { "EmployeeRequire","EmployeeGroup", "EmployeeWrite", "TypeMachine", "ProjectCodeDetail.ProjectCodeMaster" };
            return new JsonResult(
                  this.ConverterTableToViewModel<JobCardMasterViewModel, JobCardMaster>(await this.repository.GetAllWithInclude2Async(Includes)),
                  this.DefaultJsonSettings);
        }

        // GET: api/JobCardMaster/5
        [HttpGet("{key}")]
        public async Task<IActionResult> Get(int key)
        {
            //return new JsonResult(await this.repository.GetAsync(key), this.DefaultJsonSettings);
            var Includes = new List<string> { "EmployeeRequire","EmployeeGroup", "EmployeeWrite", "TypeMachine", "ProjectCodeDetail.ProjectCodeMaster" };
            return new JsonResult(
               this.mapper.Map<JobCardMaster, JobCardMasterViewModel>(await this.repository.GetAsynvWithIncludes(key, "JobCardMasterId", Includes)),
               this.DefaultJsonSettings);
        }

        // GET: api/JobCardMaster/JobCardCanCancel/5
        [HttpGet("JobCardCanCancel/{key}")]
        public async Task<IActionResult> GetJobCardCanCancel(int key)
        {
            var Includes = new List<string> { "JobCardDetails"};
            var HasData = await this.repository.GetAsynvWithIncludes(key, "JobCardMasterId", Includes);
            var CanCancel = false;
            if (HasData != null)
            {
                if (HasData.JobCardDetails.Any())
                {
                    CanCancel = !HasData.JobCardDetails.Any(x => x.JobCardDetailStatus == JobCardDetailStatus.Task);
                }
                else
                    CanCancel = true;
            }

            return new JsonResult(new { Result = CanCancel } , this.DefaultJsonSettings);
        }

        // GET: api/JobCardMaster/JobCardCanComplate/5
        [HttpGet("JobCardCanComplate/{key}")]
        public async Task<IActionResult> GetJobCardCanComplate(int key)
        {
            var Includes = new List<string> { "JobCardDetails" };
            var HasData = await this.repository.GetAsynvWithIncludes(key, "JobCardMasterId", Includes);
            var CanComplate = false;
            if (HasData != null)
            {
                if (HasData.JobCardDetails.Any())
                {
                    CanComplate = !HasData.JobCardDetails.Any(x => x.JobCardDetailStatus == JobCardDetailStatus.Wait);
                }
                else
                    CanComplate = true;
            }

            return new JsonResult(new { Result = CanComplate }, this.DefaultJsonSettings);
        }

        // GET: api/JobCardMaster/JobCardHasWait
        [HttpGet("JobCardHasWait")]
        public async Task<IActionResult> GetJobCardHasWait()
        {
            string Message = "";
            try
            {
                var QueryData = this.repository.GetAllAsQueryable()
                                               .Include(x => x.JobCardDetails)
                                               .Include(x => x.EmployeeRequire)
                                               .Include(x => x.EmployeeWrite)
                                               .Include(x => x.TypeMachine)
                                               .Include(x => x.EmployeeGroup)
                                               .Include(x => x.ProjectCodeDetail.ProjectCodeMaster)
                                               .AsQueryable();

                List<string> Only = new List<string>() { "sm", "lm" };

                QueryData = QueryData.Where(x => (x.JobCardMasterStatus == JobCardMasterStatus.Wait ||
                                                 x.JobCardMasterStatus == JobCardMasterStatus.InProcess) &&
                                                  Only.Contains(x.TypeMachine.TypeMachineCode.ToLower()));

                var GetData = await QueryData.ToListAsync();
                if (GetData.Any())
                {
                    var dataTable = new List<IDictionary<String, Object>>();
                    List<string> columns = new List<string>() { "GroupMachine", "Employee" };

                    foreach (var item in GetData.Where(x => x.JobCardDate != null).OrderBy(x => x.JobCardDate).GroupBy(x => x.JobCardDate.Value.Date)
                                                            .Select(x => x.Key))
                    {
                        columns.Add(item.ToString("dd/MM/yy"));
                    }

                    foreach(var groupMachine in GetData.GroupBy(x => x.TypeMachine))
                    {
                        foreach (var dataByEmp in groupMachine.GroupBy(x => x.EmployeeWrite))
                        {
                            if (dataByEmp == null)
                                continue;
                            else
                            {
                                IDictionary<String, Object> rowData = new ExpandoObject();
                                var EmployeeReq = dataByEmp.Key != null ? $"{(dataByEmp?.Key.NameThai ?? "")}" : "No-Data";
                                // add column time
                                rowData.Add(columns[1], EmployeeReq);
                                foreach (var item in dataByEmp)
                                {
                                    string TypeCode = item.TypeMachine == null ? "No-Data" : item.TypeMachine.TypeMachineCode;
                                    // if don't have type add item to rowdata
                                    if (!rowData.Keys.Any(x => x == "GroupMachine"))
                                        rowData.Add(columns[0], TypeCode);

                                    var key = columns.Where(y => y.Contains(item.JobCardDate.Value.ToString("dd/MM/yy"))).FirstOrDefault();
                                    // if don't have data add it to rowData
                                    if (!rowData.Keys.Any(x => x == key))
                                        rowData.Add(key, $"คลิกที่ไอคอน เพื่อแสดงข้อมูล#{item.JobCardMasterId}");
                                    else
                                        rowData[key] += $"#{item.JobCardMasterId}";
                                }
                                dataTable.Add(rowData);
                            }
                        }

                    }

                    if (dataTable.Any())
                        return new JsonResult(new
                                    {
                                        Columns = columns,
                                        DataTable = dataTable
                                    }, this.DefaultJsonSettings);
                }
            }
            catch (Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }
            return NotFound(new { Error = Message });
        }

        // GET: api/JobCardMaster/JobCardHasWaitV2
        [HttpGet("JobCardHasWaitV2")]
        public async Task<IActionResult> GetJobCardHasWaitV2()
        {
            string Message = "";
            try
            {
                var QueryData = this.repository.GetAllAsQueryable()
                                               .Include(x => x.JobCardDetails)
                                               .Include(x => x.EmployeeRequire)
                                               .Include(x => x.EmployeeWrite)
                                               .Include(x => x.TypeMachine)
                                               .Include(x => x.EmployeeGroup)
                                               .Include(x => x.ProjectCodeDetail.ProjectCodeMaster)
                                               .AsQueryable();

                QueryData = QueryData.Where(x => x.JobCardMasterStatus == JobCardMasterStatus.Wait);

                var GetData = await QueryData.ToListAsync();
                if (GetData.Any())
                {
                    var dataTable = new List<IDictionary<String, Object>>();
                    List<string> columns = new List<string>() { "GroupMachine", "Employee" };

                    foreach (var item in GetData.Where(x => x.JobCardDate != null).OrderBy(x => x.JobCardDate).GroupBy(x => x.JobCardDate.Value.Date)
                                                            .Select(x => x.Key))
                    {
                        columns.Add(item.ToString("dd/MM/yy"));
                    }

                    foreach (var groupMachine in GetData.GroupBy(x => x.TypeMachine))
                    {
                        foreach (var dataByEmp in groupMachine.GroupBy(x => x.EmployeeWrite))
                        {
                            if (dataByEmp == null)
                                continue;
                            else
                            {
                                IDictionary<String, Object> rowData = new ExpandoObject();
                                var EmployeeReq = dataByEmp.Key != null ? $"{(dataByEmp?.Key.NameThai ?? "")}" : "No-Data";
                                // add column time
                                rowData.Add(columns[1], EmployeeReq);
                                foreach (var item in dataByEmp)
                                {
                                    string TypeCode = item.TypeMachine == null ? "No-Data" : item.TypeMachine.TypeMachineCode;
                                    // if don't have type add item to rowdata
                                    if (!rowData.Keys.Any(x => x == "GroupMachine"))
                                        rowData.Add(columns[0], TypeCode);

                                    var key = columns.Where(y => y.Contains(item.JobCardDate.Value.ToString("dd/MM/yy"))).FirstOrDefault();
                                    // if don't have data add it to rowData
                                    if (!rowData.Keys.Any(x => x == key))
                                        rowData.Add(key, $"คลิกที่ไอคอน เพื่อแสดงข้อมูล#{item.JobCardMasterId}");
                                    else
                                        rowData[key] += $"#{item.JobCardMasterId}";
                                }
                                dataTable.Add(rowData);
                            }
                        }

                    }

                    if (dataTable.Any())
                        return new JsonResult(new
                        {
                            Columns = columns,
                            DataTable = dataTable
                        }, this.DefaultJsonSettings);
                }
            }
            catch (Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }
            return NotFound(new { Error = Message });
        }

        // GET: api/JobCardMaster/JobCardChangeStatus/5/1
        [HttpGet("JobCardChangeStatus/{key}/{status}")]
        public async Task<IActionResult> GetCancelJobCard(int key,int status)
        {
            if (key > 0 && status > 0)
            {
                var Includes = new List<string> { "JobCardDetails" };
                var dbJobCard = await this.repository.GetAsynvWithIncludes(key, "JobCardMasterId", Includes);
                if (dbJobCard != null)
                {
                    if (status == 2)
                    {
                        dbJobCard.JobCardMasterStatus = JobCardMasterStatus.Complete;
                    }
                    else if (status == 3)
                    {
                        dbJobCard.JobCardMasterStatus = JobCardMasterStatus.Cancel;
                        foreach (var dbJobDetail in dbJobCard.JobCardDetails)
                        {
                            dbJobDetail.JobCardDetailStatus = JobCardDetailStatus.Cancel;
                            await this.repositoryDetail.UpdateAsync(dbJobDetail, dbJobDetail.JobCardDetailId);
                        }
                    }

                    return new JsonResult(await this.repository.UpdateAsync(dbJobCard, key), this.DefaultJsonSettings);
                }
            }

            return NotFound(new { Error = "Not found key." });
        }

        // GET: api/JobCardMaster/GetCuttingPlanToJobCardDetail/5
        [HttpGet("GetCuttingPlanToJobCardDetail/{key}")]
        public async Task<IActionResult> GetCuttingPlanToJobCardDetail(int key)
        {
            var Message = "Not found JobCardMasterId";

            try
            {
                if (key > 0)
                {
                    List<string> TypeCode = new List<string>() { "gm", "cm" };
                    var JobMaster = await this.repository.GetAllAsQueryable()
                                                         .Include(x => x.TypeMachine)
                                                         .FirstOrDefaultAsync(x => x.JobCardMasterId == key &&
                                                                                    x.JobCardMasterStatus == JobCardMasterStatus.Wait &&
                                                                                    TypeCode.Contains(x.TypeMachine.TypeMachineCode.ToLower()));

                    if (JobMaster != null)
                    {
                        var CuttingPlans = this.repositoryCut.GetAllAsQueryable()
                                                    .Where(x => x.ProjectCodeDetailId == JobMaster.ProjectCodeDetailId &&
                                                                !x.JobCardDetails.Any() && x.TypeCuttingPlan == 1)
                                                    .AsQueryable();

                        if (JobMaster.TypeMachine.TypeMachineCode.ToLower().Contains("gm"))
                            CuttingPlans = CuttingPlans.Where(x => x.CuttingPlanNo.ToLower().Contains("pl"));
                        else
                            CuttingPlans = CuttingPlans.Where(x => !x.CuttingPlanNo.ToLower().Contains("pl"));

                        var ListCutting = await CuttingPlans.ToListAsync();
                        foreach (var Cutting in ListCutting)
                        {
                            await this.repositoryDetail.AddAsync(
                                new JobCardDetail()
                                {
                                    JobCardMasterId = JobMaster.JobCardMasterId,
                                    CuttingPlanId = Cutting.CuttingPlanId,
                                    JobCardDetailStatus = JobCardDetailStatus.Wait,
                                    Material = $"{Cutting.MaterialSize ?? ""} {Cutting.MaterialGrade ?? ""}",
                                    Quality = Cutting.Quantity == null ? 1 : (Cutting.Quantity < 1 ? 1 : Cutting.Quantity),
                                    Remark = "Add by system",
                                    CreateDate = DateTime.Now,
                                    Creator = "System"
                                });
                        }

                        return new JsonResult(new { Result = ListCutting.Any() }, this.DefaultJsonSettings);
                    }
                }
            }
            catch(Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }
            return NotFound(new { Error = Message });
        }

        // GET: api/JobCardMaster/CheckCuttingPlanWaiting
        [HttpGet("CheckCuttingPlanWaiting")]
        public async Task<IActionResult> CheckCuttingPlanWaiting()
        {
            var Message = "Not found Cutting plan waiting.";
            try
            {
                var hasCuttingPlanWaiting = await this.repositoryCut.GetAllAsQueryable()
                                                      .Where(x => !x.JobCardDetails.Any() && x.TypeCuttingPlan == 1)
                                                      .Include(x => x.JobCardDetails)
                                                      .AsNoTracking()
                                                      .ToListAsync();

                if (hasCuttingPlanWaiting.Any())
                {
                    foreach(var cutting in hasCuttingPlanWaiting)
                    {
                        var QueryData =  this.repository.GetAllAsQueryable()
                                                        .Where(x => x.ProjectCodeDetailId == cutting.ProjectCodeDetailId &&
                                                                    x.JobCardMasterStatus != JobCardMasterStatus.Cancel)
                                                        .OrderByDescending(x => x.JobCardMasterId)
                                                        .AsNoTracking();
                        // New JobMaster
                        JobCardMaster HasJobMaster = null;

                        if (cutting.CuttingPlanNo.ToLower().Contains("pl"))
                            HasJobMaster = await QueryData.FirstOrDefaultAsync(x => x.TypeMachine.TypeMachineCode.ToLower().Contains("gm"));
                        else
                            HasJobMaster = await QueryData.FirstOrDefaultAsync(x => x.TypeMachine.TypeMachineCode.ToLower().Contains("cm"));

                        if (HasJobMaster != null)
                        {
                            // add JobCardDetail
                            await this.repositoryDetail.AddAsync(
                               new JobCardDetail()
                               {
                                   JobCardMasterId = HasJobMaster.JobCardMasterId,
                                   CuttingPlanId = cutting.CuttingPlanId,
                                   JobCardDetailStatus = JobCardDetailStatus.Wait,
                                   Material = $"{cutting.MaterialSize ?? ""} {cutting.MaterialGrade ?? ""}",
                                   Quality = cutting.Quantity == null ? 1 : (cutting.Quantity < 1 ? 1 : cutting.Quantity),
                                   Remark = "Add by system",
                                   CreateDate = DateTime.Now,
                                   Creator = "System"
                               });

                            //check JobCardMaster status
                            if (HasJobMaster.JobCardMasterStatus != JobCardMasterStatus.InProcess)
                            {
                                HasJobMaster.JobCardMasterStatus = JobCardMasterStatus.InProcess;
                                await this.repository.UpdateAsync(HasJobMaster, HasJobMaster.JobCardMasterId);
                            }
                        }
                    }

                    return new JsonResult(new { Complate = true }, this.DefaultJsonSettings);
                }
            }
            catch(Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }
            return NotFound(new { Error = Message });
        }

        #endregion GET

        #region POST
        // POST: api/JobCardMaster/GetMultiKey
        [HttpPost("GetMultiKey")]
        public async Task<IActionResult> GetMultiKey([FromBody] List<string> ListKey)
        {
            if (ListKey != null)
            {
                var Includes = new List<string> { "ProjectCodeDetail.ProjectCodeMaster" };
                var JobCardMasters = new List<JobCardMasterViewModel>();

                foreach(var key in ListKey)
                {
                    if (int.TryParse(key, out int keyInt))
                    {
                        JobCardMasters.Add(this.mapper.Map<JobCardMaster, JobCardMasterViewModel>
                            (await this.repository.GetAsynvWithIncludes(keyInt, "JobCardMasterId", Includes)));
                    }
                }

                if (JobCardMasters.Any())
                    return new JsonResult(JobCardMasters, this.DefaultJsonSettings);
            }
            return NotFound(new { Error = "Not Found Key." });
        }


        // POST: api/JobCardMaster/GetScroll
        [HttpPost("GetScroll")]
        public async Task<IActionResult> GetScroll([FromBody] ScrollViewModel Scroll)
        {
            var Message = "";
            try
            {
                var QueryData = this.repository.GetAllAsQueryable()
                                    .Include(x => x.EmployeeRequire)
                                    .Include(x => x.EmployeeGroup)
                                    .Include(x => x.EmployeeWrite)
                                    .Include(x => x.TypeMachine)
                                    .Include(x => x.ProjectCodeDetail.ProjectCodeMaster)
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
                    QueryData = QueryData.Where(x => x.Description.ToLower().Contains(keyword) ||
                                                     x.JobCardMasterNo.ToLower().Contains(keyword) ||
                                                     x.EmployeeGroup.Description.ToLower().Contains(keyword) ||
                                                     x.EmpRequire.ToLower().Contains(keyword) ||
                                                     x.EmployeeWrite.NameThai.ToLower().Contains(keyword) ||
                                                     x.EmpWrite.ToLower().Contains(keyword) ||
                                                     x.Remark.ToLower().Contains(keyword) ||
                                                     x.ProjectCodeDetail.ProjectCodeDetailCode.ToLower().Contains(keyword) ||
                                                     x.ProjectCodeDetail.ProjectCodeMaster.ProjectCode.ToLower().Contains(keyword));
                }

                // Order
                switch (Scroll.SortField)
                {
                    case "JobCardMasterNo":
                        if (Scroll.SortOrder == -1)
                            QueryData = QueryData.OrderByDescending(e => e.JobCardMasterNo);
                        else
                            QueryData = QueryData.OrderBy(e => e.JobCardMasterNo);
                        break;

                    case "ProjectDetailString":
                        if (Scroll.SortOrder == -1)
                            QueryData = QueryData.OrderByDescending(e => e.ProjectCodeDetail.ProjectCodeDetailCode);
                        else
                            QueryData = QueryData.OrderBy(e => e.ProjectCodeDetail.ProjectCodeDetailCode);
                        break;

                    case "EmployeeRequireString":
                        if (Scroll.SortOrder == -1)
                            QueryData = QueryData.OrderByDescending(e => e.EmployeeGroup.Description);
                        else
                            QueryData = QueryData.OrderBy(e => e.EmployeeGroup.Description);
                        break;

                    case "JobCardDate":
                        if (Scroll.SortOrder == -1)
                            QueryData = QueryData.OrderByDescending(e => e.JobCardDate);
                        else
                            QueryData = QueryData.OrderBy(e => e.JobCardDate);
                        break;

                    default:
                        QueryData = QueryData.OrderByDescending(e => e.JobCardDate);
                        break;
                }

                QueryData = QueryData.Skip(Scroll.Skip ?? 0).Take(Scroll.Take ?? 50);

                return new JsonResult(new ScrollDataViewModel<JobCardMaster>
                    (Scroll,
                    this.ConverterTableToViewModel<JobCardMasterViewModel, JobCardMaster>(await QueryData.AsNoTracking().ToListAsync())
                    ), this.DefaultJsonSettings);
            }
            catch (Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }
            return NotFound(new { Error = Message });
        }

        // POST: api/JobCardMaster
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]JobCardMaster nJobCardMaster)
        {
            if (nJobCardMaster != null)
            {
                nJobCardMaster.JobCardMasterNo = await this.GeneratedCode(nJobCardMaster.ProjectCodeDetailId ?? 0,
                                                                          nJobCardMaster.TypeMachineId ?? 0);
                // add hour to DateTime to set Asia/Bangkok
                nJobCardMaster = helpers.AddHourMethod(nJobCardMaster);

                nJobCardMaster.JobCardMasterStatus = JobCardMasterStatus.Wait;
                nJobCardMaster.CreateDate = DateTime.Now;
                nJobCardMaster.Creator = nJobCardMaster.Creator ?? "Someone";

                if (nJobCardMaster.JobCardDetails != null)
                {
                    foreach (var nDetail in nJobCardMaster.JobCardDetails)
                    {
                        nDetail.JobCardDetailStatus = JobCardDetailStatus.Wait;
                        nDetail.CreateDate = nJobCardMaster.CreateDate;
                        nDetail.Creator = nJobCardMaster.Creator;
                        // Insert UnitMeasure
                        if (nDetail.UnitMeasureId < 1 && nDetail.UnitsMeasure != null)
                        {
                            nDetail.UnitsMeasure.CreateDate = nJobCardMaster.CreateDate;
                            nDetail.UnitsMeasure.Creator = nJobCardMaster.Creator;
                        }
                        else
                            nDetail.UnitsMeasure = null;
                        // Insert CuttingPlan
                        if (nDetail.CuttingPlanId < 1 && nDetail.CuttingPlan != null)
                        {
                            nDetail.CuttingPlan.CreateDate = nJobCardMaster.CreateDate;
                            nDetail.CuttingPlan.Creator = nJobCardMaster.Creator;

                            if (string.IsNullOrEmpty(nDetail?.CuttingPlan.MaterialSize))
                                nDetail.CuttingPlan.MaterialSize = nDetail.Material;

                            if (nDetail?.CuttingPlan?.Quantity == null || nDetail?.CuttingPlan?.Quantity < 1)
                                nDetail.CuttingPlan.Quantity = nDetail.Quality;
                        }
                        else
                            nDetail.CuttingPlan = null;
                    }
                }

                return new JsonResult(await this.repository.AddAsync(nJobCardMaster), this.DefaultJsonSettings);
            }

            return NotFound(new { Error = "JobCardMaster not found. " });
        }

        #endregion POST

        #region PUT

        // PUT: api/JobCardMaster/5
        [HttpPut("{key}")]
        public async Task<IActionResult> PutByNumber(int key, [FromBody]JobCardMaster uJobCardMaster)
        {
            var Message = "ProjectMaster not found. ";
            try
            {
                if (uJobCardMaster != null)
                {
                    // add hour to DateTime to set Asia/Bangkok
                    uJobCardMaster = helpers.AddHourMethod(uJobCardMaster);

                    uJobCardMaster.ModifyDate = DateTime.Now;
                    uJobCardMaster.Modifyer = uJobCardMaster.Modifyer ?? "Someone";

                    if (uJobCardMaster.JobCardMasterStatus != JobCardMasterStatus.Complete)
                    {
                        uJobCardMaster.JobCardMasterStatus = uJobCardMaster.JobCardDetails.Any(x => x.JobCardDetailStatus == JobCardDetailStatus.Wait)
                            ? JobCardMasterStatus.Wait : JobCardMasterStatus.InProcess;
                    }

                    if (uJobCardMaster.JobCardDetails != null)
                    {
                        foreach (var uDetail in uJobCardMaster.JobCardDetails)
                        {
                            if (uDetail.JobCardDetailId > 0)
                            {
                                uDetail.ModifyDate = uJobCardMaster.ModifyDate;
                                uDetail.Modifyer = uJobCardMaster.Modifyer;
                            }
                            else
                            {
                                uDetail.CreateDate = uJobCardMaster.ModifyDate;
                                uDetail.Creator = uJobCardMaster.Modifyer;
                                uDetail.JobCardDetailStatus = JobCardDetailStatus.Wait;
                            }

                            // Insert UnitMeasure
                            if (uDetail.UnitMeasureId < 1 && uDetail.UnitsMeasure != null)
                            {
                                var nUnitMeasure = VipcoMachine.Helpers.CloneObject.Clone<UnitsMeasure>(uDetail.UnitsMeasure);
                                if (nUnitMeasure != null)
                                {
                                    nUnitMeasure.CreateDate = uJobCardMaster.ModifyDate;
                                    nUnitMeasure.Creator = uJobCardMaster.Modifyer;

                                    nUnitMeasure = await this.repositoryUom.AddAsync(nUnitMeasure);
                                    uDetail.UnitMeasureId = nUnitMeasure.UnitMeasureId;
                                }
                            }

                            if (uDetail.CuttingPlanId < 1 && uDetail.CuttingPlan != null)
                            {
                                var nCuttingPlan = VipcoMachine.Helpers.CloneObject.Clone<CuttingPlan>(uDetail.CuttingPlan);
                                if (nCuttingPlan != null)
                                {
                                    nCuttingPlan.CreateDate = uJobCardMaster.ModifyDate;
                                    nCuttingPlan.Creator = uJobCardMaster.Modifyer;

                                    if (string.IsNullOrEmpty(nCuttingPlan.MaterialSize))
                                        nCuttingPlan.MaterialSize = uDetail.Material;

                                    if (nCuttingPlan?.Quantity == null || nCuttingPlan?.Quantity < 1)
                                        nCuttingPlan.Quantity = uDetail.Quality;

                                    nCuttingPlan = await this.repositoryCut.AddAsync(nCuttingPlan);
                                    uDetail.CuttingPlanId = nCuttingPlan.CuttingPlanId;
                                }
                            }

                            uDetail.CuttingPlan = null;
                            uDetail.UnitsMeasure = null;
                        }
                    }

                    // update Master not update Detail it need to update Detail directly
                    var updateComplate = await this.repository.UpdateAsync(uJobCardMaster, key);

                    if (updateComplate != null)
                    {
                        // filter
                        Expression<Func<JobCardDetail, bool>> condition = m => m.JobCardMasterId == key;
                        var dbDetails = this.repositoryDetail.FindAll(condition);

                        //Remove Jo if edit remove it
                        foreach (var dbDetail in dbDetails)
                        {
                            if (!uJobCardMaster.JobCardDetails.Any(x => x.JobCardDetailId == dbDetail.JobCardDetailId))
                                await this.repositoryDetail.DeleteAsync(dbDetail.JobCardDetailId);
                        }
                        //Update JobCardDetail or New JobCardDetail
                        foreach (var uDetail in uJobCardMaster.JobCardDetails)
                        {
                            if (uDetail.JobCardDetailId > 0)
                                await this.repositoryDetail.UpdateAsync(uDetail, uDetail.JobCardDetailId);
                            else
                            {
                                if (uDetail.JobCardDetailId < 1)
                                    uDetail.JobCardMasterId = uJobCardMaster.JobCardMasterId;

                                await this.repositoryDetail.AddAsync(uDetail);
                            }
                        }
                    }
                    return new JsonResult(updateComplate, this.DefaultJsonSettings);

                    //return new JsonResult(await this.repository.UpdateAsync(uJobCardMaster, key), this.DefaultJsonSettings);
                }

            }
            catch(Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }
            return NotFound(new { Error = Message });
        }

        #endregion PUT

        #region DELETE

        // DELETE: api/JobCardMaster/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return new JsonResult(await this.repository.DeleteAsync(id), this.DefaultJsonSettings);
        }

        #endregion DELETE

        #region ATTACH

        // GET: api/JobCardMaster/GetAttach/5
        [HttpGet("GetAttach/{JobCardMasterId}")]
        public async Task<IActionResult> GetAttach(int JobCardMasterId)
        {
            var Query = this.repositoryHasAttach.GetAllAsQueryable()
                            .Where(x => x.JobCardMasterId == JobCardMasterId)
                            .Include(x => x.AttachFile);

            return new JsonResult(await Query.Select(x => x.AttachFile).AsNoTracking().ToListAsync(), this.DefaultJsonSettings);
        }

        // POST: api/JobCardMaster/PostAttach/5/Someone
        [HttpPost("PostAttach/{JobCardMasterId}/{CreateBy}")]
        public async Task<IActionResult> PostAttac(int JobCardMasterId, string CreateBy, IEnumerable<IFormFile> files)
        {
            string Message = "";
            try
            {
                long size = files.Sum(f => f.Length);

                // full path to file in temp location
                var filePath1 = Path.GetTempFileName();

                foreach (var formFile in files)
                {
                    string FileName = Path.GetFileName(formFile.FileName).ToLower();
                    // create file name for file
                    string FileNameForRef = $"{DateTime.Now.ToString("ddMMyyhhmmssfff")}{ Path.GetExtension(FileName).ToLower()}";
                    // full path to file in temp location
                    var filePath = Path.Combine(this.appEnvironment.WebRootPath + "/files", FileNameForRef);

                    if (formFile.Length > 0)
                    {
                        using (var stream = new FileStream(filePath, FileMode.Create))
                            await formFile.CopyToAsync(stream);
                    }

                    var returnData = await this.repositoryAtt.AddAsync(new AttachFile()
                    {
                        FileAddress = $"/machine/files/{FileNameForRef}",
                        FileName = FileName,
                        CreateDate = DateTime.Now,
                        Creator = CreateBy ?? "Someone"
                    });

                    await this.repositoryHasAttach.AddAsync(new JobCardMasterHasAttach()
                    {
                        AttachFileId = returnData.AttachFileId,
                        CreateDate = DateTime.Now,
                        Creator = CreateBy ?? "Someone",
                        JobCardMasterId = JobCardMasterId
                    });
                }

                return Ok(new { count = 1, size, filePath1 });

            }
            catch (Exception ex)
            {
                Message = ex.ToString();
            }

            return NotFound(new { Error = "Not found " + Message });
        }

        // DELETE: api/TrainingCousre/DeleteAttach/5
        [HttpDelete("DeleteAttach/{AttachFileId}")]
        public async Task<IActionResult> DeleteAttach(int AttachFileId)
        {
            if (AttachFileId > 0)
            {
                var AttachFile = await this.repositoryAtt.GetAsync(AttachFileId);
                if (AttachFile != null)
                {
                    var filePath = Path.Combine(this.appEnvironment.WebRootPath + AttachFile.FileAddress);
                    FileInfo delFile = new FileInfo(filePath);

                    if (delFile.Exists)
                        delFile.Delete();
                    // Condition
                    Expression<Func<JobCardMasterHasAttach, bool>> condition = c => c.AttachFileId == AttachFile.AttachFileId;
                    var JobMasterHasAttach = this.repositoryHasAttach.FindAsync(condition).Result;
                    if (JobMasterHasAttach != null)
                        this.repositoryHasAttach.Delete(JobMasterHasAttach.JobMasterHasAttachId);
                    // remove attach
                    return new JsonResult(await this.repositoryAtt.DeleteAsync(AttachFile.AttachFileId), this.DefaultJsonSettings);
                }
            }

            return NotFound(new { Error = "Not found attach file." });
        }


        #endregion
    }
}