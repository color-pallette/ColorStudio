using System.Threading.Tasks;
using ColorStudio.DataAccess.Interface.Entities;

namespace ColorStudio.DataAccess.Interface.Repositories
{
    public interface IColorRepository : IRepository<Color>
    {
        Task<Color?> FindByHexCodeAsync(string hexCode);
    }
} 