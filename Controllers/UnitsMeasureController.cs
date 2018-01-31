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
    [Route("api/UnitsMeasure")]
    public class UnitsMeasureController : Controller
    {
        #region PrivateMenbers
        private IRepository<UnitsMeasure> repository;
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

        public UnitsMeasureController(IRepository<UnitsMeasure> repo, IMapper map)
        {
            this.repository = repo;
            this.mapper = map;
        }

        #endregion

        #region GET
        // GET: api/UnitsMeasure
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return new JsonResult(await this.repository.GetAllAsync(), this.DefaultJsonSettings);
        }

        // GET: api/UnitsMeasure/5
        [HttpGet("{key}")]
        public async Task<IActionResult> Get(int key)
        {
            return new JsonResult(await this.repository.GetAsync(key), this.DefaultJsonSettings);
        }
        #endregion

        #region POST
        // POST: api/UnitsMeasure/GetScroll
        [HttpPost("GetScroll")]
        public async Task<IActionResult> GetScroll([FromBody] ScrollViewModel Scroll)
        {
            var QueryData = this.repository.GetAllAsQueryable();
            // Filter
            var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                : Scroll.Filter.ToLower().Split(null);
            foreach (var keyword in filters)
            {
                QueryData = QueryData.Where(x => x.UnitMeasureName.ToLower().Contains(keyword));
            }

            // Order
            switch (Scroll.SortField)
            {
                case "UnitMeasureName":
                    if (Scroll.SortOrder == -1)
                        QueryData = QueryData.OrderByDescending(e => e.UnitMeasureName);
                    else
                        QueryData = QueryData.OrderBy(e => e.UnitMeasureName);
                    break;

                default:
                    QueryData = QueryData.OrderByDescending(e => e.UnitMeasureName);
                    break;
            }

            QueryData = QueryData.Skip(Scroll.Skip ?? 0).Take(Scroll.Take ?? 50);

            return new JsonResult(new ScrollDataViewModel<UnitsMeasure>
                (Scroll, await QueryData.AsNoTracking().ToListAsync()), this.DefaultJsonSettings);
        }

        // POST: api/UnitsMeasure
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]UnitsMeasure nUnitsMeasure)
        {
            if (nUnitsMeasure != null)
            {
                nUnitsMeasure.CreateDate = DateTime.Now;
                nUnitsMeasure.Creator = nUnitsMeasure.Creator ?? "Someone";

                return new JsonResult(await this.repository.AddAsync(nUnitsMeasure), this.DefaultJsonSettings);
            }

            return NotFound(new { Error = "UnitsMeasure not found." });
        }
        #endregion

        #region PUT
        // PUT: api/UnitsMeasure/5
        [HttpPut("{key}")]
        public async Task<IActionResult> PutByNumber(int key, [FromBody]UnitsMeasure uUnitsMeasure)
        {
            if (uUnitsMeasure != null)
            {
                uUnitsMeasure.ModifyDate = DateTime.Now;
                uUnitsMeasure.Modifyer = uUnitsMeasure.Modifyer ?? "Someone";

                return new JsonResult(await this.repository.UpdateAsync(uUnitsMeasure, key), this.DefaultJsonSettings);
            }
            return NotFound(new { Error = "UnitsMeasure not found." });
        }
        #endregion

        #region DELETE
        // DELETE: api/UnitsMeasure/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return new JsonResult(await this.repository.DeleteAsync(id), this.DefaultJsonSettings);
        }
        #endregion
    }
}
