using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ColorStudio.DataAccess.Interface;
using ColorStudio.DataAccess.Interface.Entities;
using ColorStudio.DataAccess.Interface.Repositories;
using ColorStudio.DataService.Interface.Services;

namespace ColorStudio.DataService.Services
{
    public class NailServiceService : INailServiceService
    {
        private readonly INailServiceRepository _nailServiceRepository;
        private readonly IUnitOfWork _unitOfWork;

        public NailServiceService(INailServiceRepository nailServiceRepository, IUnitOfWork unitOfWork)
        {
            _nailServiceRepository = nailServiceRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<NailService>> GetAllNailServicesAsync()
        {
            return await _nailServiceRepository.GetAllAsync();
        }

        public async Task<NailService?> GetNailServiceByIdAsync(int id)
        {
            return await _nailServiceRepository.GetByIdAsync(id);
        }

        public async Task<NailService> CreateNailServiceAsync(NailService nailService)
        {
            nailService.CreatedAt = DateTime.UtcNow;
            await _nailServiceRepository.AddAsync(nailService);
            await _unitOfWork.SaveChangesAsync();
            return nailService;
        }

        public async Task<NailService> UpdateNailServiceAsync(int id, NailService nailService)
        {
            var existingService = await _nailServiceRepository.GetByIdAsync(id);
            if (existingService == null)
                throw new KeyNotFoundException($"Nail service with ID {id} not found.");

            existingService.CustomerId = nailService.CustomerId;
            existingService.ServiceDate = nailService.ServiceDate;
            existingService.TotalPrice = nailService.TotalPrice;
            existingService.Notes = nailService.Notes;
            existingService.UpdatedAt = DateTime.UtcNow;

            _nailServiceRepository.Update(existingService);
            await _unitOfWork.SaveChangesAsync();
            return existingService;
        }

        public async Task<bool> DeleteNailServiceAsync(int id)
        {
            var service = await _nailServiceRepository.GetByIdAsync(id);
            if (service == null)
                return false;

            _nailServiceRepository.Delete(service);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<NailServiceImage> AddServiceImageAsync(int serviceId, NailServiceImage image)
        {
            var service = await _nailServiceRepository.GetByIdAsync(serviceId);
            if (service == null)
                throw new KeyNotFoundException($"Nail service with ID {serviceId} not found.");

            image.NailServiceId = serviceId;
            service.Images.Add(image);
            await _unitOfWork.SaveChangesAsync();
            return image;
        }

        public async Task<bool> DeleteServiceImageAsync(int serviceId, int imageId)
        {
            var service = await _nailServiceRepository.GetByIdAsync(serviceId);
            if (service == null)
                return false;

            var image = service.Images.FirstOrDefault(i => i.Id == imageId);
            if (image == null)
                return false;

            service.Images.Remove(image);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<NailServiceColor> AddServiceColorAsync(int serviceId, NailServiceColor serviceColor)
        {
            var service = await _nailServiceRepository.GetByIdAsync(serviceId);
            if (service == null)
                throw new KeyNotFoundException($"Nail service with ID {serviceId} not found.");

            serviceColor.NailServiceId = serviceId;
            service.UsedColors.Add(serviceColor);
            await _unitOfWork.SaveChangesAsync();
            return serviceColor;
        }

        public async Task<bool> UpdateServiceColorQuantityAsync(int serviceId, int colorId, int quantity)
        {
            var service = await _nailServiceRepository.GetByIdAsync(serviceId);
            if (service == null)
                return false;

            var serviceColor = service.UsedColors.FirstOrDefault(c => c.ColorId == colorId);
            if (serviceColor == null)
                return false;

            serviceColor.Quantity = quantity;
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RemoveServiceColorAsync(int serviceId, int colorId)
        {
            var service = await _nailServiceRepository.GetByIdAsync(serviceId);
            if (service == null)
                return false;

            var serviceColor = service.UsedColors.FirstOrDefault(c => c.ColorId == colorId);
            if (serviceColor == null)
                return false;

            service.UsedColors.Remove(serviceColor);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public Task<IEnumerable<NailService>> GetAllServicesAsync()
        {
            throw new NotImplementedException();
        }

        public Task<NailService> GetServiceByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<NailService>> GetServicesByCustomerIdAsync(int customerId)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<NailService>> GetServicesByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<NailService>> GetServicesByColorIdAsync(int colorId)
        {
            throw new NotImplementedException();
        }

        public Task<NailService> CreateServiceAsync(NailService service)
        {
            throw new NotImplementedException();
        }

        public Task<NailService> UpdateServiceAsync(int id, NailService service)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteServiceAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<NailService> AddColorToServiceAsync(int serviceId, int colorId, int quantity = 1)
        {
            throw new NotImplementedException();
        }

        public Task<NailService> UpdateColorQuantityAsync(int serviceId, int colorId, int quantity)
        {
            throw new NotImplementedException();
        }

        public Task<NailService> RemoveColorFromServiceAsync(int serviceId, int colorId)
        {
            throw new NotImplementedException();
        }

        public Task<NailService> AddImageToServiceAsync(int serviceId, string imagePath, string? imageTitle = null, string? description = null)
        {
            throw new NotImplementedException();
        }

        public Task<bool> RemoveImageFromServiceAsync(int serviceId, int imageId)
        {
            throw new NotImplementedException();
        }
    }
} 