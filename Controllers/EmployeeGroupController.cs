using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using VipcoMachine.Models;
using VipcoMachine.Services.Interfaces;
using VipcoMachine.ViewModels;

namespace VipcoMachine.Controllers
{
    [Produces("application/json")]
    [Route("api/EmployeeGroup")]
    public class EmployeeGroupController : Controller
    {
        #region PrivateMenbers

        private IRepository<EmployeeGroup> repository;
        private IRepository<EmployeeGroupMIS> repositoryMis;
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

        public EmployeeGroupController(
            IRepository<EmployeeGroup> repo,
            IRepository<Employee> repoEmp,
            IRepository<EmployeeGroupMIS> repoMis,
            IMapper map)
        {
            this.repository = repo;
            this.repositoryMis = repoMis;
            this.repositoryEmployee = repoEmp;
            this.mapper = map;
        }

        #endregion Constructor

        #region GET

        // GET: api/EmployeeGroup
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var GroupEmployee = await this.repositoryEmployee.GetAllAsQueryable()
                                            .GroupBy(x => x.GroupCode)
                                            .Select(x => x.Key)
                                            .ToListAsync();

            var QueryData = this.repository.GetAllAsQueryable()
                                           .Where(x => GroupEmployee.Contains(x.GroupCode));

            return new JsonResult(await QueryData.ToListAsync(), this.DefaultJsonSettings);
        }

        // GET: api/EmployeeGroup/5
        [HttpGet("{key}")]
        public async Task<IActionResult> Get(string key)
        {
            return new JsonResult(await this.repository.GetAsync(key),this.DefaultJsonSettings);
        }

        // GET: api/EmployeeGroup/Mis
        [HttpGet("Mis")]
        public async Task<IActionResult> GetMis()
        {
            Expression<Func<EmployeeGroupMIS, bool>> expression = e => !e.GroupMIS.StartsWith("00");
            return new JsonResult(await this.repositoryMis.FindAllAsync(expression), this.DefaultJsonSettings);
        }

        [HttpGet("Mis/{key}")]
        public async Task<IActionResult> GetMis(string key)
        {
            return new JsonResult(await this.repositoryMis.GetAsync(key), this.DefaultJsonSettings);

        }
        #endregion GET

        #region POST

        // POST: api/EmployeeGroup/GetPage
        [HttpPost("GetScroll")]
        public async Task<IActionResult> GetScroll([FromBody] ScrollViewModel Scroll)
        {
            //var GroupEmployee = await this.repositoryEmployee.GetAllAsQueryable()
            //                                .GroupBy(x => x.GroupCode)
            //                                .Select(x => x.Key)
            //                                .ToListAsync();

            var QueryData = this.repository.GetAllAsQueryable()
                                           // .Where(x => GroupEmployee.Contains(x.GroupCode))
                                           .AsQueryable()
                                           .Where(x => !x.GroupCode.StartsWith('1') &&
                                                       !x.GroupCode.StartsWith("2") &&
                                                       !x.GroupCode.StartsWith("3"));
            // Filter
            var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                : Scroll.Filter.ToLower().Split(null);
            foreach (var keyword in filters)
            {
                QueryData = QueryData.Where(x => x.GroupCode.ToLower().Contains(keyword) ||
                                                 x.Description.ToLower().Contains(keyword));
            }

            // Order
            switch (Scroll.SortField)
            {
                case "GroupCode":
                    if (Scroll.SortOrder == -1)
                        QueryData = QueryData.OrderByDescending(e => e.GroupCode);
                    else
                        QueryData = QueryData.OrderBy(e => e.GroupCode);
                    break;

                case "Description":
                    if (Scroll.SortOrder == -1)
                        QueryData = QueryData.OrderByDescending(e => e.Description);
                    else
                        QueryData = QueryData.OrderBy(e => e.Description);
                    break;

                default:
                    QueryData = QueryData.OrderByDescending(e => e.Description);
                    break;
            }

            QueryData = QueryData.Skip(Scroll.Skip ?? 0).Take(Scroll.Take ?? 50);

            return new JsonResult(new ScrollDataViewModel<EmployeeGroup>
                (Scroll,await QueryData.AsNoTracking().ToListAsync()),this.DefaultJsonSettings);
        }

        // POST: api/EmployeeGroup
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]EmployeeGroup nEmployeeGroup)
        {
            if (nEmployeeGroup != null)
            {
                if (nEmployeeGroup.OverTimeMasters != null)
                    nEmployeeGroup.OverTimeMasters = null;

                return new JsonResult(await this.repository.AddAsync(nEmployeeGroup), this.DefaultJsonSettings);
            }
            return NotFound(new { Error = "EmployeeGroup not found. " });
        }
        #endregion POST

        #region PUT

        // PUT: api/EmployeeGroup/5
        [HttpPut("{key}")]
        public async Task<IActionResult> PutByNumber(string key, [FromBody]EmployeeGroup uEmployeeGroup)
        {
            if (uEmployeeGroup != null)
            {
                if (uEmployeeGroup.OverTimeMasters != null)
                    uEmployeeGroup.OverTimeMasters = null;

                return new JsonResult(await this.repository.UpdateAsync(uEmployeeGroup, key), this.DefaultJsonSettings);
            }
            return NotFound(new { Error = "EmployeeGroup not found. " });
        }

        #endregion PUT

        #region DELETE

        // DELETE: api/EmployeeGroup/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            return new JsonResult(await this.repository.DeleteAsync(id), this.DefaultJsonSettings);
        }

        #endregion DELETE
    }
}