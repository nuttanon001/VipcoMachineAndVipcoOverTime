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
using VipcoMachine.Helpers;
using VipcoMachine.ViewModels;
using VipcoMachine.Services.Interfaces;

namespace VipcoMachine.Controllers
{
    [Produces("application/json")]
    [Route("api/Holiday")]
    public class HolidayController : Controller
    {
        #region PrivateMenbers
        private IRepository<HolidayOverTime> repository;
        private IMapper mapper;
        private HelpersClass<HolidayOverTime> helpers;

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

        public HolidayController(IRepository<HolidayOverTime> repo, IMapper map)
        {
            this.repository = repo;
            this.mapper = map;
            this.helpers = new HelpersClass<HolidayOverTime>();
        }

        #endregion

        #region GET

        // GET: api/Holiday/
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return new JsonResult(await this.repository.GetAllAsync(), this.DefaultJsonSettings);
        }

        // GET: api/Holiday/5
        [HttpGet("{key}")]
        public async Task<IActionResult> Get(int key)
        {
            return new JsonResult(await this.repository.GetAsync(key), this.DefaultJsonSettings);
        }

        #endregion

        #region POST

        // POST: api/Holiday/GetScroll
        [HttpPost("GetScroll")]
        public async Task<IActionResult> GetScroll([FromBody] ScrollViewModel Scroll)
        {
            var QueryData = this.repository.GetAllAsQueryable();
            // Filter
            var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                : Scroll.Filter.ToLower().Split(null);
            foreach (var keyword in filters)
            {
                QueryData = QueryData.Where(x => x.HolidayName.ToLower().Contains(keyword));
            }

            // Order
            switch (Scroll.SortField)
            {
                case "HolidayName":
                    if (Scroll.SortOrder == -1)
                        QueryData = QueryData.OrderByDescending(e => e.HolidayName);
                    else
                        QueryData = QueryData.OrderBy(e => e.HolidayName);
                    break;

                case "HolidayDate":
                    if (Scroll.SortOrder == -1)
                        QueryData = QueryData.OrderByDescending(e => e.HolidayDate);
                    else
                        QueryData = QueryData.OrderBy(e => e.HolidayDate);
                    break;

                default:
                    QueryData = QueryData.OrderByDescending(e => e.HolidayDate.Value.Date);
                    break;
            }

            // Skip and Take
            QueryData = QueryData.Skip(Scroll.Skip ?? 0).Take(Scroll.Take ?? 50);

            return new JsonResult(new ScrollDataViewModel<HolidayOverTime>
                (Scroll,await QueryData.AsNoTracking().ToListAsync()),this.DefaultJsonSettings);
        }

        // POST: api/Holiday
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]HolidayOverTime nHolidayOverTime)
        {
            if (nHolidayOverTime != null)
            {
                nHolidayOverTime = helpers.AddHourMethod(nHolidayOverTime);
                return new JsonResult(await this.repository.AddAsync(nHolidayOverTime), this.DefaultJsonSettings);
            }
            return NotFound(new { Error = "Not found employee." });
        }

        #endregion

        #region PUT

        // PUT: api/Holiday/5
        [HttpPut("{key}")]
        public async Task<IActionResult> PutByString(int key, [FromBody]HolidayOverTime uHolidayOverTime)
        {
            if (uHolidayOverTime != null)
            {
                uHolidayOverTime = helpers.AddHourMethod(uHolidayOverTime);
                return new JsonResult(await this.repository.UpdateAsync(uHolidayOverTime, key), this.DefaultJsonSettings);
            }
            return NotFound(new { Error = "Not found employee." });
        }

        #endregion

        #region DELETE
        // DELETE: api/Holiday/5
        [HttpDelete("{key}")]
        public async Task<IActionResult> Delete(int key)
        {
            return new JsonResult(await this.repository.DeleteAsync(key), this.DefaultJsonSettings);
        }
        #endregion
    }
}
