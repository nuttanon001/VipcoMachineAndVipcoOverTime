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
    [Route("api/Material")]
    public class MaterialController : Controller
    {
        #region PrivateMenbers
        private IRepository<Material> repository;
        private IRepository<JobCardDetail> repositoryJobDetail;
        private IRepository<CuttingPlan> repositoryCuttingPlan;
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

        public MaterialController(
            IRepository<Material> repo,
            IRepository<JobCardDetail> repoJobDetail,
            IRepository<CuttingPlan> repoCuttingPlan,
            IMapper map)
        {
            this.repository = repo;
            this.repositoryJobDetail = repoJobDetail;
            this.repositoryCuttingPlan = repoCuttingPlan;
            this.mapper = map;
        }

        #endregion

        #region GET

        // GET: api/Material/
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var Includes = new List<string> { "GradeMaterial" , "ClassificationMaterial" };

            return new JsonResult(
                 this.ConverterTableToViewModel<MaterialViewModel, Material>(await this.repository.GetAllWithInclude2Async(Includes)),
                 this.DefaultJsonSettings);
            //return new JsonResult(await this.repository.GetAllAsync(), this.DefaultJsonSettings);
        }

        // GET: api/Material/5
        [HttpGet("{key}")]
        public async Task<IActionResult> Get(int key)
        {
            var Includes = new List<string> { "GradeMaterial", "ClassificationMaterial" };
            return new JsonResult(
              this.mapper.Map<Material, MaterialViewModel>(await this.repository.GetAsynvWithIncludes(key, "MaterialId", Includes)),
              this.DefaultJsonSettings);
            //return new JsonResult(await this.repository.GetAsync(key), this.DefaultJsonSettings);
        }

        [HttpGet("GetAutoComplate")]
        public async Task<IActionResult> GetAutoComplate()
        {
            var Message = "";
            try
            {
                var autoComplate = new List<string>();
                var material = await this.repositoryCuttingPlan.GetAllAsync();
                if (material != null)
                {
                    foreach(var item in material.Where(x => !string.IsNullOrEmpty(x.MaterialSize))
                        .Select(x => x.MaterialSize +  (string.IsNullOrEmpty(x.MaterialGrade) ? "" : " | " + x.MaterialGrade))
                        .Distinct())
                    {
                        autoComplate.Add(item);
                    }
                }

                var jobDetail = await this.repositoryJobDetail.GetAllAsync();
                if (jobDetail != null)
                {
                    foreach(var item in jobDetail.Select(x => x.Material).Distinct())
                    {
                        if (!autoComplate.Any(x => x == item))
                        {
                            autoComplate.Add(item);
                        }
                    }
                }

                if (autoComplate.Any())
                    return new JsonResult(autoComplate, this.DefaultJsonSettings);
            }
            catch(Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }
            return NotFound(new { Error = Message });
        }
        #endregion

        #region POST

        // POST: api/Material/GetScroll
        [HttpPost("GetScroll")]
        public async Task<IActionResult> GetScroll([FromBody] ScrollViewModel Scroll)
        {
            var QueryData = this.repository.GetAllAsQueryable().AsQueryable();
            // Filter
            var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                : Scroll.Filter.ToLower().Split(null);
            foreach (var keyword in filters)
            {
                QueryData = QueryData.Where(x => x.Size.ToLower().Contains(keyword) ||
                                                 x.Grade.ToLower().Contains(keyword));
            }

            // Order
            switch (Scroll.SortField)
            {
                case "Size":
                    if (Scroll.SortOrder == -1)
                        QueryData = QueryData.OrderByDescending(e => e.Size);
                    else
                        QueryData = QueryData.OrderBy(e => e.Size);
                    break;

                //case "ClassificationString":
                //    if (Scroll.SortOrder == -1)
                //        QueryData = QueryData.OrderByDescending(e => e.ClassificationMaterial.ClassificationCode);
                //    else
                //        QueryData = QueryData.OrderBy(e => e.ClassificationMaterial.ClassificationCode);
                //    break;

                case "Grade":
                    if (Scroll.SortOrder == -1)
                        QueryData = QueryData.OrderByDescending(e => e.Grade);
                    else
                        QueryData = QueryData.OrderBy(e => e.Grade);
                    break;

                default:
                    QueryData = QueryData.OrderByDescending(e => e.Size);
                    break;
            }

            QueryData = QueryData.Skip(Scroll.Skip ?? 0).Take(Scroll.Take ?? 50);

            return new JsonResult(new ScrollDataViewModel<MaterialViewModel>
                (
                    Scroll,
                    this.ConverterTableToViewModel<MaterialViewModel,Material>(await QueryData.AsNoTracking().ToListAsync())
                ), this.DefaultJsonSettings);
        }

        // POST: api/Material
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]Material nMaterial)
        {
            nMaterial.CreateDate = DateTime.Now;
            nMaterial.Creator = nMaterial.Creator ?? "Someone";

            return new JsonResult(await this.repository.AddAsync(nMaterial), this.DefaultJsonSettings);
        }

        #endregion

        #region PUT
        // PUT: api/Material/5
        [HttpPut("{key}")]
        public async Task<IActionResult> PutByNumber(int key, [FromBody]Material uMaterial)
        {
            uMaterial.ModifyDate = DateTime.Now;
            uMaterial.Modifyer = uMaterial.Modifyer ?? "Someone";

            return new JsonResult(await this.repository.UpdateAsync(uMaterial, key), this.DefaultJsonSettings);
        }
        #endregion

        #region DELETE
        // DELETE: api/Material/5
        [HttpDelete("{key}")]
        public async Task<IActionResult> Delete(int key)
        {
            return new JsonResult(await this.repository.DeleteAsync(key), this.DefaultJsonSettings);
        }
        #endregion
    }
}
