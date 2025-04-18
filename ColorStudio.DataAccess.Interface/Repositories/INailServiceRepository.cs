using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ColorStudio.DataAccess.Interface.Entities;

namespace ColorStudio.DataAccess.Interface.Repositories
{
    public interface INailServiceRepository : IRepository<NailService>
    {
        Task<IEnumerable<NailService>> GetServicesByCustomerIdAsync(int customerId);
        Task<IEnumerable<NailService>> GetServicesByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<NailService>> GetServicesByColorIdAsync(int colorId);
    }
} 