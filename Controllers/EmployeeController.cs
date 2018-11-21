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
    [Route("api/Employee")]
    public class EmployeeController : Controller
    {
        #region PrivateMenbers
        private readonly IRepository<Employee> repository;
        private readonly IRepository<EmployeeGroupMIS> repositoryMis;
        private readonly IRepository<EmployeeLocation> repositoryEmpLocation;
        private readonly IMapper mapper;
        private readonly ApplicationContext context;

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

        public EmployeeController(IRepository<Employee> repo, 
            IRepository<EmployeeGroupMIS> repoMis,
            IRepository<EmployeeLocation> repoEmpLocation,
            ApplicationContext context, IMapper map)
        {
            this.repository = repo;
            this.repositoryMis = repoMis;
            this.repositoryEmpLocation = repoEmpLocation;
            this.mapper = map;
            this.context = context;
        }

        #endregion

        #region GET

        // GET: api/Employee/
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return new JsonResult(await this.repository.GetAllAsync(), this.DefaultJsonSettings);
        }

        // GET: api/Employee/5
        [HttpGet("{key}")]
        public async Task<IActionResult> Get(string key)
        {
            return new JsonResult(
                this.mapper.Map<Employee,EmployeeViewModel>(await this.repository.GetAsync(key)),
                this.DefaultJsonSettings);
        }

        [HttpGet("SubContractor")]
        public async Task<IActionResult> GetSubContractor()
        {
            var QueryData = this.repository.GetAllAsQueryable()
                                           .Where(x => x.TypeEmployee == TypeEmployee.พนักงานพม่า)
                                           .AsNoTracking();

            return new JsonResult(this.ConverterTableToViewModel<EmployeeViewModel, Employee>
                (await QueryData.ToListAsync()), this.DefaultJsonSettings);
        }

        // GET: api/Employee/GetLocation/5
        [HttpGet("GetLocation/{EmpCode}")]
        public async Task<IActionResult> GetLocationByEmp(string EmpCode)
        {
            var Message = "Data not been found.";

            try
            {
                var HasData = await this.repositoryEmpLocation.FindAsync(x => x.EmpCode == EmpCode);
                if (HasData != null)
                    return new JsonResult(HasData, this.DefaultJsonSettings);
            }
            catch(Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }
            return BadRequest(new { Message });
        }

        // GET: api/Employee/GetByMaster/5
        [HttpGet("GetByMaster/{MasterCode}")]
        public async Task<IActionResult> GetByMaster(string MasterCode)
        {
            var QueryData = this.repository.GetAllAsQueryable()
                                           .Where(x => x.GroupCode == MasterCode);
            // .Include(x => x.ProjectCodeDetail.ProjectCodeMaster)
            return new JsonResult(await QueryData.AsNoTracking().ToListAsync(),this.DefaultJsonSettings);
        }

        #endregion

        #region POST

        // POST: api/Employee/GetPage
        [HttpPost("GetScroll")]
        public async Task<IActionResult> GetScroll([FromBody] ScrollViewModel Scroll)
        {
            var QueryData2 = this.context.Employees.Join(
                this.context.EmployeeLocations,
                x => x.EmpCode,
                z => z.EmpCode, (emp, loc) => new { emp, loc }).AsQueryable();

            if (!string.IsNullOrEmpty(Scroll.Location))
            {
                if (Scroll.Location.IndexOf("V00") == -1)
                {
                    if (Scroll.Location.IndexOf("V02") != -1)
                        QueryData2 = QueryData2.Where(x => x.loc.LocationCode == Scroll.Location || x.loc == null);
                    else
                        QueryData2 = QueryData2.Where(x => x.loc.LocationCode == Scroll.Location);
                }
            }

            // var QueryData = this.repository.GetAllAsQueryable();
            // Where
            if (!string.IsNullOrEmpty(Scroll.Where))
            {
                if (Scroll.Where.IndexOf("SubContractor") != -1)
                    QueryData2 = QueryData2.Where(x => x.emp.TypeEmployee == TypeEmployee.พนักงานพม่า);
                else
                    QueryData2 = QueryData2.Where(x => x.emp.GroupCode == Scroll.Where);
            }
            // Filter
            var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                : Scroll.Filter.ToLower().Split(null);
            foreach (var keyword in filters)
            {
                QueryData2 = QueryData2.Where(x => x.emp.NameEng.ToLower().Contains(keyword) ||
                                                 x.emp.NameThai.ToLower().Contains(keyword) ||
                                                 x.emp.EmpCode.ToLower().Contains(keyword) ||
                                                 x.emp.GroupCode.ToLower().Contains(keyword) ||
                                                 x.emp.GroupName.ToLower().Contains(keyword));
            }

            // Order
            switch (Scroll.SortField)
            {
                case "EmpCode":
                    if (Scroll.SortOrder == -1)
                        QueryData2 = QueryData2.OrderByDescending(e => e.emp.EmpCode);
                    else
                        QueryData2 = QueryData2.OrderBy(e => e.emp.EmpCode);
                    break;

                case "NameThai":
                    if (Scroll.SortOrder == -1)
                        QueryData2 = QueryData2.OrderByDescending(e => e.emp.NameThai);
                    else
                        QueryData2 = QueryData2.OrderBy(e => e.emp.NameThai);
                    break;

                case "NameEng":
                    if (Scroll.SortOrder == -1)
                        QueryData2 = QueryData2.OrderByDescending(e => e.emp.NameEng);
                    else
                        QueryData2 = QueryData2.OrderBy(e => e.emp.NameEng);
                    break;

                default:
                    QueryData2 = QueryData2.OrderByDescending(e => e.emp.EmpCode.Length)
                                         .ThenBy(e => e.emp.EmpCode);
                    break;
            }

            // Skip and Take
            QueryData2 = QueryData2.Skip(Scroll.Skip ?? 0).Take(Scroll.Take ?? 50);
            var MapDatas = new List<EmployeeViewModel>();

            foreach (var item in await QueryData2.AsNoTracking().ToListAsync())
                MapDatas.Add(this.mapper.Map<Employee, EmployeeViewModel>(item.emp));

            return new JsonResult(new ScrollDataViewModel<Employee>
                (Scroll,MapDatas),this.DefaultJsonSettings);
        }

        [HttpPost("GetScrollMis")]
        public async Task<IActionResult> GetScrollMis([FromBody] ScrollViewModel Scroll)
        {
            var QueryData2 = (from emp in this.context.Employees
                             join loc in this.context.EmployeeLocations on emp.EmpCode equals loc.EmpCode into emp_loc
                             from all1 in emp_loc.DefaultIfEmpty()
                             select new
                             {
                                 emp,
                                 loc = all1,
                             }).AsQueryable();

            if (!string.IsNullOrEmpty(Scroll.Location))
            {
                if (Scroll.Location.IndexOf("V00") == -1)
                {
                    if (Scroll.Location.IndexOf("V02") != -1)
                        QueryData2 = QueryData2.Where(x => x.loc.LocationCode == Scroll.Location ||
                                                           x.loc == null ||
                                                           x.loc.LocationCode == null);
                    else
                        QueryData2 = QueryData2.Where(x => x.loc.LocationCode == Scroll.Location);
                }
            }

            // var QueryData = this.repository.GetAllAsQueryable();

            // Where
            if (!string.IsNullOrEmpty(Scroll.Where))
            {
                if (Scroll.Where.IndexOf("SubContractor") != -1)
                    QueryData2 = QueryData2.Where(x => x.emp.TypeEmployee == TypeEmployee.พนักงานพม่า);
                else
                    QueryData2 = QueryData2.Where(x => x.emp.GroupMIS == Scroll.Where);
            }

            // Filter
            var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                : Scroll.Filter.ToLower().Split(null);
            foreach (var keyword in filters)
            {
                QueryData2 = QueryData2.Where(x => x.emp.NameEng.ToLower().Contains(keyword) ||
                                                 x.emp.NameThai.ToLower().Contains(keyword) ||
                                                 x.emp.EmpCode.ToLower().Contains(keyword) ||
                                                 x.emp.GroupCode.ToLower().Contains(keyword) ||
                                                 x.emp.GroupName.ToLower().Contains(keyword));
            }

            // Order
            switch (Scroll.SortField)
            {
                case "EmpCode":
                    if (Scroll.SortOrder == -1)
                        QueryData2 = QueryData2.OrderByDescending(e => e.emp.EmpCode);
                    else
                        QueryData2 = QueryData2.OrderBy(e => e.emp.EmpCode);
                    break;

                case "NameThai":
                    if (Scroll.SortOrder == -1)
                        QueryData2 = QueryData2.OrderByDescending(e => e.emp.NameThai);
                    else
                        QueryData2 = QueryData2.OrderBy(e => e.emp.NameThai);
                    break;

                case "NameEng":
                    if (Scroll.SortOrder == -1)
                        QueryData2 = QueryData2.OrderByDescending(e => e.emp.NameEng);
                    else
                        QueryData2 = QueryData2.OrderBy(e => e.emp.NameEng);
                    break;

                default:
                    QueryData2 = QueryData2.OrderByDescending(e => e.emp.EmpCode.Length)
                                         .ThenBy(e => e.emp.EmpCode);
                    break;
            }

            // Skip and Take
            QueryData2 = QueryData2.Skip(Scroll.Skip ?? 0).Take(Scroll.Take ?? 50);
            var HasData = await QueryData2.ToListAsync();

            var MapDatas = new List<EmployeeViewModel>();
            foreach (var item in HasData)
                MapDatas.Add(this.mapper.Map<Employee, EmployeeViewModel>(item.emp));

            return new JsonResult(new ScrollDataViewModel<Employee>
                (Scroll,MapDatas),this.DefaultJsonSettings);
        }
        // POST: api/Employee
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]Employee nEmployee)
        {
            if (nEmployee != null)
            {
                return new JsonResult(await this.repository.AddAsync(nEmployee), this.DefaultJsonSettings);
            }
            return NotFound(new { Error = "Not found employee." });
        }

        #endregion

        #region PUT
        // PUT: api/Employee/5
        [HttpPut("{key}")]
        public async Task<IActionResult> PutByString(string key, [FromBody]Employee uEmployee)
        {
            if (uEmployee != null)
            {
                if (!string.IsNullOrEmpty(uEmployee.GroupMIS))
                    uEmployee.GroupName = (await this.repositoryMis.GetAllAsQueryable().FirstOrDefaultAsync(x => x.GroupMIS == uEmployee.GroupMIS)).GroupDesc ?? "";

                return new JsonResult(await this.repository.UpdateAsync(uEmployee, key), this.DefaultJsonSettings);
            }
            return NotFound(new { Error = "Not found employee." });
        }

        #endregion

        #region DELETE
        // DELETE: api/Employee/5
        [HttpDelete("{key}")]
        public async Task<IActionResult> Delete(string key)
        {
            return new JsonResult(await this.repository.DeleteAsync(key), this.DefaultJsonSettings);
        }
        #endregion
    }
}
