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
    [Route("api/Classification")]
    public class ClassificationController : Controller
    {
        #region PrivateMenbers
        private IRepository<ClassificationMaterial> repository;
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

        public ClassificationController(IRepository<ClassificationMaterial> repo, IMapper map)
        {
            this.repository = repo;
            this.mapper = map;
        }

        #endregion

        #region GET
        // GET: api/Classification
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return new JsonResult(await this.repository.GetAllAsync(), this.DefaultJsonSettings);
        }

        // GET: api/Classification/5
        [HttpGet("{key}")]
        public async Task<IActionResult> Get(int key)
        {
            return new JsonResult(await this.repository.GetAsync(key), this.DefaultJsonSettings);
        }

        #endregion

        #region POST
        // POST: api/Classification
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]ClassificationMaterial nClassification)
        {
            nClassification.CreateDate = DateTime.Now;
            nClassification.Creator = nClassification.Creator ?? "Someone";

            return new JsonResult(await this.repository.AddAsync(nClassification), this.DefaultJsonSettings);
        }
        #endregion

        #region PUT
        // PUT: api/Classification/5
        [HttpPut("{key}")]
        public async Task<IActionResult> PutByNumber(int key, [FromBody]ClassificationMaterial uClassification)
        {
            uClassification.ModifyDate = DateTime.Now;
            uClassification.Modifyer = uClassification.Modifyer ?? "Someone";

            return new JsonResult(await this.repository.UpdateAsync(uClassification, key), this.DefaultJsonSettings);
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
