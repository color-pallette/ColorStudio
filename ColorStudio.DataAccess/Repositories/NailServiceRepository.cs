using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ColorStudio.DataAccess.Context;
using ColorStudio.DataAccess.Interface.Entities;
using ColorStudio.DataAccess.Interface.Repositories;

namespace ColorStudio.DataAccess.Repositories
{
    public class NailServiceRepository : Repository<NailService>, INailServiceRepository
    {
        private readonly DatabaseContext _context;

        public NailServiceRepository(DatabaseContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<NailService>> GetServicesByCustomerIdAsync(int customerId)
        {
            return await _context.NailServices
                .Include(ns => ns.UsedColors)
                .Include(ns => ns.Images)
                .Where(ns => ns.CustomerId == customerId)
                .OrderByDescending(ns => ns.ServiceDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<NailService>> GetServicesByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _context.NailServices
                .Include(ns => ns.UsedColors)
                .Include(ns => ns.Images)
                .Where(ns => ns.ServiceDate >= startDate && ns.ServiceDate <= endDate)
                .OrderByDescending(ns => ns.ServiceDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<NailService>> GetServicesByColorIdAsync(int colorId)
        {
            return await _context.NailServices
                .Include(ns => ns.UsedColors)
                .Include(ns => ns.Images)
                //.Where(ns => ns.UsedColors.Any(uc => uc.ColorId == colorId))
                .OrderByDescending(ns => ns.ServiceDate)
                .ToListAsync();
        }
    }
} 