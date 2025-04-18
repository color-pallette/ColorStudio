using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ColorStudio.DataAccess.Interface;
using ColorStudio.DataAccess.Interface.Entities;
using ColorStudio.DataAccess.Interface.Repositories;
using ColorStudio.DataService.Interface.Services;

namespace ColorStudio.DataService.Services
{
    public class ColorService : IColorService
    {
        private readonly IColorRepository _colorRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ColorService(IColorRepository colorRepository, IUnitOfWork unitOfWork)
        {
            _colorRepository = colorRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<Color>> GetAllColorsAsync()
        {
            return await _colorRepository.GetAllAsync();
        }

        public async Task<Color> GetColorByIdAsync(int id)
        {
            var color = await _colorRepository.GetByIdAsync(id);
            if (color == null)
                throw new KeyNotFoundException($"Color with ID {id} not found.");
            return color;
        }

        public async Task<Color?> GetColorByHexCodeAsync(string hexCode)
        {
            return await _colorRepository.FindByHexCodeAsync(hexCode);
        }

        public async Task<Color> CreateColorAsync(Color color)
        {
            await _colorRepository.AddAsync(color);
            await _unitOfWork.SaveChangesAsync();
            return color;
        }

        public async Task<Color> UpdateColorAsync(int id, Color color)
        {
            var existingColor = await GetColorByIdAsync(id);
            
            existingColor.Name = color.Name;
            existingColor.HexCode = color.HexCode;
            existingColor.Brand = color.Brand;
            existingColor.Price = color.Price;
            existingColor.Stock = color.Stock;
            existingColor.Description = color.Description;
            existingColor.Volume = color.Volume;

            _colorRepository.Update(existingColor);
            await _unitOfWork.SaveChangesAsync();
            return existingColor;
        }

        public async Task<bool> DeleteColorAsync(int id)
        {
            var color = await GetColorByIdAsync(id);
            _colorRepository.Delete(color);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        // Image management methods
        public async Task<Color> AddImageToColorAsync(int colorId, string imagePath, string? imageTitle = null)
        {
            var color = await GetColorByIdAsync(colorId);

            if (!string.IsNullOrEmpty(color.ImagePath))
                throw new InvalidOperationException($"Color with ID {colorId} already has an image. Use UpdateColorImage instead.");

            color.ImagePath = imagePath;
            color.ImageTitle = imageTitle;
            color.ImageUploadedAt = DateTime.UtcNow;

            _colorRepository.Update(color);
            await _unitOfWork.SaveChangesAsync();

            return color;
        }

        public async Task<Color> UpdateColorImageAsync(int colorId, string imagePath, string? imageTitle = null)
        {
            var color = await GetColorByIdAsync(colorId);

            color.ImagePath = imagePath;
            color.ImageTitle = imageTitle;
            color.ImageUploadedAt = DateTime.UtcNow;

            _colorRepository.Update(color);
            await _unitOfWork.SaveChangesAsync();

            return color;
        }

        public async Task<bool> RemoveColorImageAsync(int colorId)
        {
            var color = await GetColorByIdAsync(colorId);

            if (string.IsNullOrEmpty(color.ImagePath))
                throw new InvalidOperationException($"Color with ID {colorId} does not have an image.");

            color.ImagePath = null;
            color.ImageTitle = null;
            color.ImageUploadedAt = null;

            _colorRepository.Update(color);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }
    }
}
