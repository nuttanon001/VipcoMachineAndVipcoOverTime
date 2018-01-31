using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VipcoMachine.Helpers
{
    public class HelpersClass<TEntity> where TEntity : class
    {
        public TEntity AddHourMethod(TEntity entity)
        {
            var properties = entity.GetType().GetProperties();
            foreach (var property in properties)
            {
                if (property.PropertyType == typeof(DateTime))
                {
                    if (property.GetValue(entity, null) != null)
                    {
                        property.SetValue(entity, ((DateTime)property.GetValue(entity, null)).AddHours(7), null);
                    }
                }
                else if (property.PropertyType == typeof(Nullable<DateTime>))
                {
                    if (property.GetValue(entity, null) != null)
                    {
                        property.SetValue(entity, ((DateTime)property.GetValue(entity, null)).AddHours(7), null);
                    }
                }
            }
            return entity;
        }
    }
}
