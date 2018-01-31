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
    [Route("api/TypeMachine")]
    public class TypeMachineController : Controller
    {
        #region PrivateMenbers
        private IRepository<TypeMachine> repository;
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

        public TypeMachineController(IRepository<TypeMachine> repo, IMapper map)
        {
            this.repository = repo;
            this.mapper = map;
        }

        #endregion

        #region GET
        // GET: api/TypeMachine
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return new JsonResult(await this.repository.GetAllAsync(), this.DefaultJsonSettings);
        }

        // GET: api/TypeMachine/5
        [HttpGet("{key}")]
        public async Task<IActionResult> Get(int key)
        {
            return new JsonResult(await this.repository.GetAsync(key), this.DefaultJsonSettings);
        }
        #endregion

        #region POST
        // POST: api/TypeMachine
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]TypeMachine nTypeMachine)
        {
            if (nTypeMachine != null)
            {
                nTypeMachine.CreateDate = DateTime.Now;
                nTypeMachine.Creator = nTypeMachine.Creator ?? "Someone";

                return new JsonResult(await this.repository.AddAsync(nTypeMachine), this.DefaultJsonSettings);
            }

            return NotFound(new { Error = "TypeMachine not found." });
        }
        #endregion

        #region PUT
        // PUT: api/TypeMachine/5
        [HttpPut("{key}")]
        public async Task<IActionResult> PutByNumber(int key, [FromBody]TypeMachine uTypeMachine)
        {
            if (uTypeMachine != null)
            {
                uTypeMachine.ModifyDate = DateTime.Now;
                uTypeMachine.Modifyer = uTypeMachine.Modifyer ?? "Someone";

                return new JsonResult(await this.repository.UpdateAsync(uTypeMachine, key), this.DefaultJsonSettings);
            }
            return NotFound(new { Error = "TypeMachine not found." });
        }
        #endregion

        #region DELETE
        // DELETE: api/TypeMachine/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return new JsonResult(await this.repository.DeleteAsync(id), this.DefaultJsonSettings);
        }
        #endregion
    }
}
