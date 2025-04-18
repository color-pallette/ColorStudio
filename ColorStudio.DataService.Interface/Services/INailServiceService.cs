using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ColorStudio.DataAccess.Interface.Entities;

namespace ColorStudio.DataService.Interface.Services
{
    public interface INailServiceService
    {
        Task<IEnumerable<NailService>> GetAllServicesAsync();
        Task<NailService> GetServiceByIdAsync(int id);
        Task<IEnumerable<NailService>> GetServicesByCustomerIdAsync(int customerId);
        Task<IEnumerable<NailService>> GetServicesByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<NailService>> GetServicesByColorIdAsync(int colorId);
        Task<NailService> CreateServiceAsync(NailService service);
        Task<NailService> UpdateServiceAsync(int id, NailService service);
        Task<bool> DeleteServiceAsync(int id);
        Task<NailService> AddColorToServiceAsync(int serviceId, int colorId, int quantity = 1);
        Task<NailService> UpdateColorQuantityAsync(int serviceId, int colorId, int quantity);
        Task<NailService> RemoveColorFromServiceAsync(int serviceId, int colorId);
        Task<NailService> AddImageToServiceAsync(int serviceId, string imagePath, string? imageTitle = null, string? description = null);
        Task<bool> RemoveImageFromServiceAsync(int serviceId, int imageId);
        Task<IEnumerable<NailService>> GetAllNailServicesAsync();
        Task<NailService?> GetNailServiceByIdAsync(int id);
        Task<NailService> CreateNailServiceAsync(NailService nailService);
        Task<NailService> UpdateNailServiceAsync(int id, NailService nailService);
        Task<bool> DeleteNailServiceAsync(int id);
        Task<NailServiceImage> AddServiceImageAsync(int serviceId, NailServiceImage image);
        Task<bool> DeleteServiceImageAsync(int serviceId, int imageId);
        Task<NailServiceColor> AddServiceColorAsync(int serviceId, NailServiceColor serviceColor);
        Task<bool> UpdateServiceColorQuantityAsync(int serviceId, int colorId, int quantity);
        Task<bool> RemoveServiceColorAsync(int serviceId, int colorId);
    }
} 