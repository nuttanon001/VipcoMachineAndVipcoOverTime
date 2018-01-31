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
    [Route("api/TemplateProjectDetail")]
    public class TemplateProjectDetailController : Controller
    {
        #region PrivateMenbers
        private IRepository<TemplateProjectDetail> repository;
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

        public TemplateProjectDetailController(IRepository<TemplateProjectDetail> repo, IMapper map)
        {
            this.repository = repo;
            this.mapper = map;
        }

        #endregion

        #region GET
        // GET: api/TemplateProjectDetail
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return new JsonResult(await this.repository.GetAllAsync(), this.DefaultJsonSettings);
        }

        // GET: api/TemplateProjectDetail/5
        [HttpGet("{key}")]
        public async Task<IActionResult> Get(int key)
        {
            return new JsonResult(await this.repository.GetAsync(key), this.DefaultJsonSettings);
        }
        #endregion

        #region POST

        // POST: api/TemplateProjectDetail
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]TemplateProjectDetail nTemplateProject)
        {
            nTemplateProject.CreateDate = DateTime.Now;
            nTemplateProject.Creator = nTemplateProject.Creator ?? "Someone";

            return new JsonResult(await this.repository.AddAsync(nTemplateProject), this.DefaultJsonSettings);
        }

        #endregion

        #region PUT
        // PUT: api/TemplateProjectDetail/5
        [HttpPut("{key}")]
        public async Task<IActionResult> PutByNumber(int key, [FromBody]TemplateProjectDetail uTemplateProject)
        {
            uTemplateProject.ModifyDate = DateTime.Now;
            uTemplateProject.Modifyer = uTemplateProject.Modifyer ?? "Someone";

            return new JsonResult(await this.repository.UpdateAsync(uTemplateProject, key), this.DefaultJsonSettings);
        }
        #endregion

        #region DELETE
        // DELETE: api/TemplateProjectDetail/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return new JsonResult(await this.repository.DeleteAsync(id), this.DefaultJsonSettings);
        }
        #endregion
    }
}
