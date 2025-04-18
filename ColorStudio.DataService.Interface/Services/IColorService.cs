using System.Collections.Generic;
using System.Threading.Tasks;
using ColorStudio.DataAccess.Interface.Entities;

namespace ColorStudio.DataService.Interface.Services
{
    public interface IColorService
    {
        Task<IEnumerable<Color>> GetAllColorsAsync();
        Task<Color> GetColorByIdAsync(int id);
        Task<Color?> GetColorByHexCodeAsync(string hexCode);
        Task<Color> CreateColorAsync(Color color);
        Task<Color> UpdateColorAsync(int id, Color color);
        Task<bool> DeleteColorAsync(int id);

        // Image management methods
        Task<Color> AddImageToColorAsync(int colorId, string imagePath, string? imageTitle = null);
        Task<Color> UpdateColorImageAsync(int colorId, string imagePath, string? imageTitle = null);
        Task<bool> RemoveColorImageAsync(int colorId);
    }
}
