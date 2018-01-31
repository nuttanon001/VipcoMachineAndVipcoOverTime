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
    [Route("api/Operator")]
    public class OperatorController : Controller
    {
        #region PrivateMenbers
        private IRepository<MachineHasOperator> repository;
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

        public OperatorController(IRepository<MachineHasOperator> repo, IMapper map)
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
            return new JsonResult(await this.repository.GetAllAsync(), this.DefaultJsonSettings);
        }

        // GET: api/JobCardDetail/5
        [HttpGet("{key}")]
        public async Task<IActionResult> Get(int key)
        {
            return new JsonResult(await this.repository.GetAsync(key), this.DefaultJsonSettings);
        }
        // GET: api/JobCardDetail/GetByMaster/5
        [HttpGet("GetByMaster/{MasterId}")]
        public async Task<IActionResult> GetByMaster(int MasterId)
        {
            Expression<Func<MachineHasOperator, bool>> Condition = c => c.MachineId == MasterId;
            var Includes = new List<string> { "Employee" };

            return new JsonResult(this.ConverterTableToViewModel<OperatorViewModel, MachineHasOperator>
                        (
                            await this.repository.GetAllWithConditionAndIncludeAsync(Condition,Includes)
                        ), this.DefaultJsonSettings);
        }
        #endregion

        #region POST
        // POST: api/Operator
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]MachineHasOperator nOperator)
        {
            nOperator.CreateDate = DateTime.Now;
            nOperator.Creator = nOperator.Creator ?? "Someone";

            return new JsonResult(await this.repository.AddAsync(nOperator), this.DefaultJsonSettings);
        }
        #endregion

        #region PUT
        // PUT: api/Operator/5
        [HttpPut("{key}")]
        public async Task<IActionResult> PutByNumber(int key, [FromBody]MachineHasOperator uOperator)
        {
            uOperator.ModifyDate = DateTime.Now;
            uOperator.Modifyer = uOperator.Modifyer ?? "Someone";

            return new JsonResult(await this.repository.UpdateAsync(uOperator, key), this.DefaultJsonSettings);
        }
        #endregion

        #region DELETE
        // DELETE: api/Operator/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return new JsonResult(await this.repository.DeleteAsync(id), this.DefaultJsonSettings);
        }
        #endregion
    }
}
