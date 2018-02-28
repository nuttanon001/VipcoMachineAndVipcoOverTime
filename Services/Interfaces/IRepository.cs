using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace VipcoMachine.Services.Interfaces
{
    public interface IRepository<TEntity> where TEntity : class
    {
        Task<TEntity> GetAsync(int id);
        Task<TEntity> GetAsync(string TEntityId);
        Task<TEntity> GetAsynvWithIncludes(int id, string PkName, List<string> Includes = null);

        TEntity Get(string TEntityId);
        TEntity Get(int id);
        IQueryable<TEntity> GetAllAsQueryable(Expression<Func<TEntity, string>> order = null);
        Task<ICollection<TEntity>> GetAllAsync();
        Task<ICollection<TEntity>> GetAllWithRelateAsync(Expression<Func<TEntity, bool>> match = null);
        Task<ICollection<TEntity>> GetAllWithConditionAndIncludeAsync(
            Expression<Func<TEntity, bool>> Condition = null, List<string> Includes = null);
        Task<ICollection<TEntity>> GetAllWithIncludeAsync
            (List<Expression<Func<TEntity, object>>> relates);
        Task<ICollection<TEntity>> GetAllWithInclude2Async(List<string> includes);
        Task<TEntity> FindAsync(Expression<Func<TEntity, bool>> match);
        TEntity Find(Expression<Func<TEntity, bool>> match);
        Task<ICollection<TEntity>> FindAllAsync(Expression<Func<TEntity, bool>> match);
        ICollection<TEntity> FindAll(Expression<Func<TEntity, bool>> match);
        Task<ICollection<TEntity>> FindAllWithIncludeAsync
            (Expression<Func<TEntity, bool>> match, List<Expression<Func<TEntity, object>>> relates);

        ICollection<TEntity> FindAllWithLazyLoad
            (Expression<Func<TEntity, bool>> match,
            List<Expression<Func<TEntity, object>>> relates,
            int Skip, int Row,
            Expression<Func<TEntity, string>> order = null,
            Expression<Func<TEntity, string>> orderDesc = null);

        Task<ICollection<TEntity>> FindAllWithLazyLoadAsync
            (Expression<Func<TEntity, bool>> match,
            List<Expression<Func<TEntity, object>>> relates,
            int Skip, int Row,
            Expression<Func<TEntity, string>> order = null,
            Expression<Func<TEntity, string>> orderDesc = null);
        TEntity Add(TEntity nTEntity);
        Task<TEntity> AddAsync(TEntity nTEntity);
        Task<IEnumerable<TEntity>> AddAllAsync(IEnumerable<TEntity> nTEntityList);
        Task<TEntity> UpdateAsync(TEntity updated, int key);
        Task<TEntity> UpdateAsync(TEntity updated, string key);
        TEntity Update(TEntity updated, string key);
        TEntity Update(TEntity updated, int key);
        void Delete(int key);
        Task<int> DeleteAsync(string TEntityId);
        Task<int> DeleteAsync(int key);
        Task<int> CountAsync();
        int CountWithMatch(Expression<Func<TEntity, bool>> match);
        Task<int> CountWithMatchAsync(Expression<Func<TEntity, bool>> match);
        Task<bool> AnyDataAsync(Expression<Func<TEntity, bool>> match);
    }
}
