using AutoMapper;
using Newtonsoft.Json;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Linq.Expressions;
using System.Collections.Generic;

using VipcoMachine.Models;
// using VipcoMachine.ViewModels;
using VipcoMachine.Services.Interfaces;

namespace VipcoMachine.Controllers
{
    public class BaseController<TEntity> : Controller
        where TEntity : class, new()
    {

        #region PrivateMenbers
        public IRepository<TEntity> repository;
        public IMapper mapper;

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

        // GET: api/_NAMEWEBAPI_
        [HttpGet]
        public IActionResult Get()
        {
            return new JsonResult(this.repository.GetAllAsync().Result, this.DefaultJsonSettings);
        }

        // GET: api/_NAMEWEBAPI_/GetByNumber/5
        [HttpGet("GetByNumber/{id}")]
        public IActionResult GetNumber(int key)
        {
            return new JsonResult(this.repository.GetAsync(key).Result, this.DefaultJsonSettings);
        }

        // GET: api/_NAMEWEBAPI_/GetByString/5
        [HttpGet("GetByString/{id}")]
        public IActionResult GetString(string key)
        {
            return new JsonResult(this.repository.GetAsync(key).Result, this.DefaultJsonSettings);
        }

        // POST: api/_NAMEWEBAPI_
        [HttpPost]
        public IActionResult Post([FromBody]TEntity InsertValue)
        {
            return new JsonResult(this.repository.AddAsync(InsertValue).Result, this.DefaultJsonSettings);
        }

        // PUT: api/_NAMEWEBAPI_/PutByNumber/5
        [HttpPut("PutByNumber/{key}")]
        public IActionResult PutByNumber(int key, [FromBody]TEntity UpdateValue)
        {
            return new JsonResult(this.repository.UpdateAsync(UpdateValue, key).Result, this.DefaultJsonSettings);
        }

        // PUT: api/_NAMEWEBAPI_/PutByString/5
        [HttpPut("PutByString/{key}")]
        public IActionResult PutByString(int key, [FromBody]TEntity UpdateValue)
        {
            return new JsonResult(this.repository.UpdateAsync(UpdateValue, key).Result, this.DefaultJsonSettings);
        }

        // DELETE: api/_NAMEWEBAPI_/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            return new JsonResult(this.repository.DeleteAsync(id).Result, this.DefaultJsonSettings);
        }
    }
}
