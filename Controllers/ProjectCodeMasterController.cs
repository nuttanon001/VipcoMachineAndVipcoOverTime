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
using VipcoMachine.Helpers;

namespace VipcoMachine.Controllers
{
    [Produces("application/json")]
    [Route("api/ProjectCodeMaster")]
    public class ProjectCodeMasterController : Controller
    {

        #region PrivateMenbers
        private IRepository<ProjectCodeMaster> repository;
        private IRepository<ProjectCodeDetail> repositoryDetail;
        private HelpersClass<ProjectCodeMaster> helpers;

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

        public ProjectCodeMasterController(
            IRepository<ProjectCodeMaster> repo,
            IRepository<ProjectCodeDetail> repoDetail,
            IMapper map)
        {
            this.repository = repo;
            this.repositoryDetail = repoDetail;
            this.mapper = map;
            this.helpers = new HelpersClass<ProjectCodeMaster>();
        }

        #endregion

        #region GET

        // GET: api/ProjectCodeMaster/
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return new JsonResult(await this.repository.GetAllAsync(), this.DefaultJsonSettings);
        }

        // GET: api/ProjectCodeMaster/5
        [HttpGet("{key}")]
        public async Task<IActionResult> Get(int key)
        {
            return new JsonResult(await this.repository.GetAsync(key), this.DefaultJsonSettings);
        }

        #endregion

        #region POST

        // POST: api/ProjectCodeMaster/GetScroll
        [HttpPost("GetScroll")]
        public async Task<IActionResult> GetScroll([FromBody] ScrollViewModel Scroll)
        {
            var QueryData = this.repository.GetAllAsQueryable().AsQueryable();
            // Filter
            var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                : Scroll.Filter.ToLower().Split(null);

            foreach (var keyword in filters)
            {
                QueryData = QueryData.Where(x => x.ProjectCode.ToLower().Contains(keyword) ||
                                                 x.ProjectName.ToLower().Contains(keyword) ||
                                                 x.ProjectCodeDetails
                                                 .Any(z => z.ProjectCodeDetailCode.ToLower().Contains(keyword) ||
                                                           z.Description.ToLower().Contains(keyword)));
            }

            // Order
            switch (Scroll.SortField)
            {
                case "ProjectCode":
                    if (Scroll.SortOrder == -1)
                        QueryData = QueryData.OrderByDescending(e => e.ProjectCode);
                    else
                        QueryData = QueryData.OrderBy(e => e.ProjectCode);
                    break;

                case "ProjectName":
                    if (Scroll.SortOrder == -1)
                        QueryData = QueryData.OrderByDescending(e => e.ProjectName);
                    else
                        QueryData = QueryData.OrderBy(e => e.ProjectName);
                    break;

                case "StartDate":
                    if (Scroll.SortOrder == -1)
                        QueryData = QueryData.OrderByDescending(e => e.StartDate);
                    else
                        QueryData = QueryData.OrderBy(e => e.StartDate);
                    break;

                default:
                    QueryData = QueryData.OrderByDescending(e => e.ProjectCode);
                    break;
            }

            QueryData = QueryData.Skip(Scroll.Skip ?? 0).Take(Scroll.Take ?? 50);

            return new JsonResult(new ScrollDataViewModel<ProjectCodeMaster>
                (Scroll, await QueryData.AsNoTracking().ToListAsync()), this.DefaultJsonSettings);
        }

        // POST: api/ProjectCodeMaster
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]ProjectCodeMaster nProjectCodeMaster)
        {
            if (nProjectCodeMaster != null)
            {
                // add hour to DateTime to set Asia/Bangkok
                nProjectCodeMaster = helpers.AddHourMethod(nProjectCodeMaster);

                nProjectCodeMaster.CreateDate = DateTime.Now;
                nProjectCodeMaster.Creator = nProjectCodeMaster.Creator ?? "Someone";

                if (nProjectCodeMaster.ProjectCodeDetails != null)
                {
                    foreach (var nDetail in nProjectCodeMaster.ProjectCodeDetails)
                    {
                        nDetail.CreateDate = nProjectCodeMaster.CreateDate;
                        nDetail.Creator = nProjectCodeMaster.Creator;
                    }
                }

                return new JsonResult(await this.repository.AddAsync(nProjectCodeMaster), this.DefaultJsonSettings);
            }

            return NotFound(new { Error = "ProjectMaster not found. " });
        }

        #endregion

        #region PUT
        // PUT: api/ProjectCodeMaster/5
        [HttpPut("{key}")]
        public async Task<IActionResult> PutByNumber(int key, [FromBody]ProjectCodeMaster uProjectCodeMaster)
        {
            if (uProjectCodeMaster != null)
            {
                // add hour to DateTime to set Asia/Bangkok
                uProjectCodeMaster = helpers.AddHourMethod(uProjectCodeMaster);
                // set modified
                uProjectCodeMaster.ModifyDate = DateTime.Now;
                uProjectCodeMaster.Modifyer = uProjectCodeMaster.Modifyer ?? "Someone";

                if (uProjectCodeMaster.ProjectCodeDetails != null)
                {
                    foreach (var detail in uProjectCodeMaster.ProjectCodeDetails)
                    {
                        if (detail.ProjectCodeDetailId > 0)
                        {
                            detail.ModifyDate = uProjectCodeMaster.ModifyDate;
                            detail.Modifyer = uProjectCodeMaster.Modifyer;
                        }
                        else
                        {
                            detail.CreateDate = uProjectCodeMaster.ModifyDate;
                            detail.Creator = uProjectCodeMaster.Modifyer;
                        }
                    }
                }
                // update Master not update Detail it need to update Detail directly
                var updateComplate = await this.repository.UpdateAsync(uProjectCodeMaster, key);

                if (updateComplate != null)
                {
                    // filter
                    Expression<Func<ProjectCodeDetail, bool>> condition = m => m.ProjectCodeMasterId == key;
                    var dbDetails = this.repositoryDetail.FindAll(condition);

                    //Remove ProjectCodeDetails if edit remove it
                    foreach (var dbDetail in dbDetails)
                    {
                        var Message = "";
                        try
                        {
                            if (!uProjectCodeMaster.ProjectCodeDetails.Any(x => x.ProjectCodeDetailId == dbDetail.ProjectCodeDetailId))
                                await this.repositoryDetail.DeleteAsync(dbDetail.ProjectCodeDetailId);
                        }
                        catch(Exception ex)
                        {
                            Message = ex.ToString();
                        }

                    }
                    //Update ProjectCodeDetails
                    foreach (var uDetail in uProjectCodeMaster.ProjectCodeDetails)
                    {
                        if (uDetail.ProjectCodeDetailId > 0)
                            await this.repositoryDetail.UpdateAsync(uDetail, uDetail.ProjectCodeDetailId);
                        else
                        {
                            if (uDetail.ProjectCodeMasterId < 1)
                                uDetail.ProjectCodeMasterId = uProjectCodeMaster.ProjectCodeMasterId;

                            await this.repositoryDetail.AddAsync(uDetail);
                        }
                    }
                }
                return new JsonResult(updateComplate, this.DefaultJsonSettings);
            }

            return NotFound(new { Error = "ProjectMaster not found. "});
        }
        #endregion

        #region DELETE
        // DELETE: api/JobCardMaster/5
        [HttpDelete("{key}")]
        public async Task<IActionResult> Delete(int key)
        {
            return new JsonResult(await this.repository.DeleteAsync(key), this.DefaultJsonSettings);
        }
        #endregion
    }
}
