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
    [Route("api/PropertyMachine")]
    public class PropertyMachineController : Controller
    {
        #region PrivateMenbers
        private IRepository<PropertyMachine> repository;
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

        public PropertyMachineController(IRepository<PropertyMachine> repo, IMapper map)
        {
            this.repository = repo;
            this.mapper = map;
        }

        #endregion

        #region GET
        // GET: api/PropertyMachine
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return new JsonResult(await this.repository.GetAllAsync(), this.DefaultJsonSettings);
        }

        // GET: api/PropertyMachine/5
        [HttpGet("{key}")]
        public async Task<IActionResult> Get(int key)
        {
            return new JsonResult(await this.repository.GetAsync(key), this.DefaultJsonSettings);
        }
        #endregion

        #region POST
        // POST: api/PropertyMachine
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]PropertyMachine nPropertyMachine)
        {
            nPropertyMachine.CreateDate = DateTime.Now;
            nPropertyMachine.Creator = nPropertyMachine.Creator ?? "Someone";

            return new JsonResult(await this.repository.AddAsync(nPropertyMachine), this.DefaultJsonSettings);
        }
        #endregion

        #region PUT
        // PUT: api/PropertyMachine/5
        [HttpPut("{key}")]
        public async Task<IActionResult> PutByNumber(int key, [FromBody]PropertyMachine uPropertyMachine)
        {
            uPropertyMachine.ModifyDate = DateTime.Now;
            uPropertyMachine.Modifyer = uPropertyMachine.Modifyer ?? "Someone";

            return new JsonResult(await this.repository.UpdateAsync(uPropertyMachine, key), this.DefaultJsonSettings);
        }
        #endregion

        #region DELETE
        // DELETE: api/PropertyMachine/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return new JsonResult(await this.repository.DeleteAsync(id), this.DefaultJsonSettings);
        }
        #endregion
    }
}
