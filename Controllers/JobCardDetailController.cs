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
