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
    [Route("api/OverTime")]
    public class OverTimeController : Controller
    {
        #region PrivateMenbers
        private IRepository<TaskMachineHasOverTime> repository;
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

        public OverTimeController(IRepository<TaskMachineHasOverTime> repo, IMapper map)
        {
            this.repository = repo;
            this.mapper = map;
        }

        #endregion

        #region GET
        // GET: api/OverTime
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return new JsonResult(await this.repository.GetAllAsync(), this.DefaultJsonSettings);
        }

        // GET: api/OverTime/5
        [HttpGet("{key}")]
        public async Task<IActionResult> Get(int key)
        {
            return new JsonResult(await this.repository.GetAsync(key), this.DefaultJsonSettings);
        }
        // GET: api/OverTime/GetByMaster/5
        [HttpGet("GetByMaster/{MasterId}")]
        public async Task<IActionResult> GetByMaster(int MasterId)
        {
            var QueryData = this.repository.GetAllAsQueryable()
                                .Where(x => x.TaskMachineId == MasterId)
                                .Include(x => x.Employee);

            return new JsonResult(
                this.ConverterTableToViewModel<OverTimeViewModel, TaskMachineHasOverTime>(await QueryData.AsNoTracking().ToListAsync()),
                this.DefaultJsonSettings);
        }
        #endregion

        #region POST
        // POST: api/OverTime
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]TaskMachineHasOverTime nOverTime)
        {
            nOverTime.CreateDate = DateTime.Now;
            nOverTime.Creator = nOverTime.Creator ?? "Someone";

            return new JsonResult(await this.repository.AddAsync(nOverTime), this.DefaultJsonSettings);
        }
        #endregion

        #region PUT
        // PUT: api/OverTime/5
        [HttpPut("{key}")]
        public async Task<IActionResult> PutByNumber(int key, [FromBody]TaskMachineHasOverTime uOverTime)
        {
            uOverTime.ModifyDate = DateTime.Now;
            uOverTime.Modifyer = uOverTime.Modifyer ?? "Someone";

            return new JsonResult(await this.repository.UpdateAsync(uOverTime, key), this.DefaultJsonSettings);
        }
        #endregion

        #region DELETE
        // DELETE: api/OverTime/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return new JsonResult(await this.repository.DeleteAsync(id), this.DefaultJsonSettings);
        }
        #endregion
    }
}
