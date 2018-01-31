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
    [Route("api/OverTimeDetail")]
    public class OverTimeDetailController : Controller
    {
        #region PrivateMenbers
        private IRepository<OverTimeDetail> repository;
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

        public OverTimeDetailController(IRepository<OverTimeDetail> repo, IMapper map)
        {
            this.repository = repo;
            this.mapper = map;
        }

        #endregion

        #region GET
        // GET: api/OverTimeDetail
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var Includes = new List<string> { "Employee" };

            return new JsonResult(
                  this.ConverterTableToViewModel<OverTimeDetailViewModel, OverTimeDetail>(await this.repository.GetAllWithInclude2Async(Includes)),
                  this.DefaultJsonSettings);

            //return new JsonResult(await this.repository.GetAllAsync(), this.DefaultJsonSettings);
        }

        // GET: api/OverTimeDetail/5
        [HttpGet("{key}")]
        public async Task<IActionResult> Get(int key)
        {
            var Includes = new List<string> { "Employee" };
            return new JsonResult(
               this.mapper.Map<OverTimeDetail, OverTimeDetailViewModel>(await this.repository.GetAsynvWithIncludes(key, "OverTimeDetailId", Includes)),
               this.DefaultJsonSettings);
            //return new JsonResult(await this.repository.GetAsync(key), this.DefaultJsonSettings);
        }

        // GET: api/OverTimeDetail/GetByMaster/5
        [HttpGet("GetByMaster/{MasterId}")]
        public async Task<IActionResult> GetByMaster(int MasterId)
        {
            var QueryData = this.repository.GetAllAsQueryable()
                                .Where(x => x.OverTimeMasterId == MasterId)
                                .Include(x => x.Employee);
            return new JsonResult(
                this.ConverterTableToViewModel<OverTimeDetailViewModel, OverTimeDetail>(await QueryData.AsNoTracking().ToListAsync()),
                this.DefaultJsonSettings);
        }
        #endregion

        #region POST
        // POST: api/OverTimeDetail
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]OverTimeDetail nOverTimeDetail)
        {
            nOverTimeDetail.CreateDate = DateTime.Now;
            nOverTimeDetail.Creator = nOverTimeDetail.Creator ?? "Someone";

            return new JsonResult(await this.repository.AddAsync(nOverTimeDetail), this.DefaultJsonSettings);
        }
        #endregion

        #region PUT
        // PUT: api/OverTimeDetail/5
        [HttpPut("{key}")]
        public async Task<IActionResult> PutByNumber(int key, [FromBody]OverTimeDetail uOverTimeDetail)
        {
            uOverTimeDetail.ModifyDate = DateTime.Now;
            uOverTimeDetail.Modifyer = uOverTimeDetail.Modifyer ?? "Someone";

            return new JsonResult(await this.repository.UpdateAsync(uOverTimeDetail, key), this.DefaultJsonSettings);
        }
        #endregion

        #region DELETE
        // DELETE: api/OverTimeDetail/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return new JsonResult(await this.repository.DeleteAsync(id), this.DefaultJsonSettings);
        }
        #endregion
    }
}
