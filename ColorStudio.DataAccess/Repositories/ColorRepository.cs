using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using ColorStudio.DataAccess.Context;
using ColorStudio.DataAccess.Interface.Entities;
using ColorStudio.DataAccess.Interface.Repositories;

namespace ColorStudio.DataAccess.Repositories
{
    public class ColorRepository : Repository<Color>, IColorRepository
    {
        private readonly DatabaseContext _context;

        public ColorRepository(DatabaseContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Color?> FindByHexCodeAsync(string hexCode)
        {
            return await _context.Colors
                .FirstOrDefaultAsync(c => c.HexCode == hexCode);
        }
    }
} 