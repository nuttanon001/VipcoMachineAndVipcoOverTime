using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System;
using System.Linq;
using System.Threading.Tasks;
using System.Linq.Expressions;
using System.Collections.Generic;

using VipcoMachine.Models;
using VipcoMachine.Services.Interfaces;
using VipcoMachine.ViewModels;
// 3rd Party
using Newtonsoft.Json;
using AutoMapper;

namespace VipcoMachine.Controllers
{
    [Produces("application/json")]
    [Route("api/EmployeeGroupMis")]
    public class EmployeeGroupMisController : Controller
    {
        #region PrivateMenbers

        private IRepository<EmployeeGroupMIS> repository;
        private IRepository<Employee> repositoryEmployee;
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

        public EmployeeGroupMisController(
            IRepository<EmployeeGroupMIS> repo,
            IRepository<Employee> repoEmp,
            IMapper map)
        {
            this.repository = repo;
            this.repositoryEmployee = repoEmp;
            this.mapper = map;
        }

        #endregion Constructor

        #region GET

        // GET: api/EmployeeGroupMis
        [HttpGet()]
        public async Task<IActionResult> GetMis()
        {
            return new JsonResult(await this.repository.GetAllAsync(), this.DefaultJsonSettings);
        }

        // GET: api/EmployeeGroupMis/5
        [HttpGet("{key}")]
        public async Task<IActionResult> GetMis(string key)
        {
            return new JsonResult(await this.repository.GetAsync(key), this.DefaultJsonSettings);

        }
        #endregion GET

        #region POST

        // POST: api/EmployeeGroup/GetPage
        [HttpPost("GetScroll")]
        public async Task<IActionResult> GetScroll([FromBody] ScrollViewModel Scroll)
        {

            var QueryData = this.repository.GetAllAsQueryable()
                                           .AsQueryable();

            // Filter
            var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                : Scroll.Filter.ToLower().Split(null);
            foreach (var keyword in filters)
            {
                QueryData = QueryData.Where(x => x.GroupMIS.ToLower().Contains(keyword) ||
                                                 x.GroupDesc.ToLower().Contains(keyword));
            }

            // Order
            switch (Scroll.SortField)
            {
                case "GroupMIS":
                    if (Scroll.SortOrder == -1)
                        QueryData = QueryData.OrderByDescending(e => e.GroupMIS);
                    else
                        QueryData = QueryData.OrderBy(e => e.GroupMIS);
                    break;

                case "GroupDesc":
                    if (Scroll.SortOrder == -1)
                        QueryData = QueryData.OrderByDescending(e => e.GroupDesc);
                    else
                        QueryData = QueryData.OrderBy(e => e.GroupDesc);
                    break;

                default:
                    QueryData = QueryData.OrderByDescending(e => e.GroupDesc);
                    break;
            }

            QueryData = QueryData.Skip(Scroll.Skip ?? 0).Take(Scroll.Take ?? 50);

            return new JsonResult(new ScrollDataViewModel<EmployeeGroupMIS>
                (Scroll, await QueryData.AsNoTracking().ToListAsync()), this.DefaultJsonSettings);
        }

        // POST: api/EmployeeGroupMis
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]EmployeeGroupMIS nEmployeeGroupMis)
        {
            if (nEmployeeGroupMis != null)
            {
                return new JsonResult(await this.repository.AddAsync(nEmployeeGroupMis), this.DefaultJsonSettings);
            }
            return NotFound(new { Error = "EmployeeGroup not found. " });
        }
        #endregion POST

        #region PUT

        // PUT: api/EmployeeGroupMis/5
        [HttpPut("{key}")]
        public async Task<IActionResult> PutByNumber(string key, [FromBody]EmployeeGroupMIS uEmployeeGroupMis)
        {
            if (uEmployeeGroupMis != null)
            {
                return new JsonResult(await this.repository.UpdateAsync(uEmployeeGroupMis, key), this.DefaultJsonSettings);
            }
            return NotFound(new { Error = "EmployeeGroup not found. " });
        }

        #endregion PUT

        #region DELETE

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            return new JsonResult(await this.repository.DeleteAsync(id), this.DefaultJsonSettings);
        }

        #endregion DELETE
    }
}
