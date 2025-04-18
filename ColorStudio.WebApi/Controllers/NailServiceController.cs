using Microsoft.AspNetCore.Mvc;
using ColorStudio.DataService.Interface.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ColorStudio.DataAccess.Interface.Entities;

namespace ColorStudio.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NailServiceController : ControllerBase
    {
        private readonly INailServiceService _nailServiceService;

        public NailServiceController(INailServiceService nailServiceService)
        {
            _nailServiceService = nailServiceService;
        }

        /// <summary>
        /// Get all nail services
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<NailService>), 200)]
        public async Task<IActionResult> GetNailServices()
        {
            var services = await _nailServiceService.GetAllNailServicesAsync();
            return Ok(services);
        }

        /// <summary>
        /// Get a nail service by ID
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(NailService), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetNailService(int id)
        {
            try
            {
                var service = await _nailServiceService.GetNailServiceByIdAsync(id);
                return Ok(service);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        /// <summary>
        /// Create a new nail service
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(NailService), 201)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> CreateNailService([FromBody] NailService nailService)
        {
            try
            {
                var createdService = await _nailServiceService.CreateNailServiceAsync(nailService);
                return CreatedAtAction(nameof(GetNailService), new { id = createdService.Id }, createdService);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Update an existing nail service
        /// </summary>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(NailService), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateNailService(int id, [FromBody] NailService nailService)
        {
            try
            {
                var updatedService = await _nailServiceService.UpdateNailServiceAsync(id, nailService);
                return Ok(updatedService);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        /// <summary>
        /// Delete a nail service
        /// </summary>
        [HttpDelete("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> DeleteNailService(int id)
        {
            try
            {
                await _nailServiceService.DeleteNailServiceAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        /// <summary>
        /// Add an image to a nail service
        /// </summary>
        [HttpPost("{id}/images")]
        [ProducesResponseType(typeof(NailServiceImage), 201)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> AddServiceImage(int id, [FromBody] NailServiceImage image)
        {
            try
            {
                var addedImage = await _nailServiceService.AddImageToServiceAsync(id, image.ImagePath);
                return CreatedAtAction(nameof(GetNailService), new { id }, addedImage);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        /// <summary>
        /// Delete an image from a nail service
        /// </summary>
        [HttpDelete("{serviceId}/images/{imageId}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> DeleteServiceImage(int serviceId, int imageId)
        {
            try
            {
                await _nailServiceService.DeleteServiceImageAsync(serviceId, imageId);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        /// <summary>
        /// Add a color to a nail service
        /// </summary>
        [HttpPost("{id}/colors")]
        [ProducesResponseType(typeof(NailServiceColor), 201)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> AddServiceColor(int id, [FromBody] NailServiceColor serviceColor)
        {
            try
            {
                var addedColor = await _nailServiceService.AddColorToServiceAsync(id, serviceColor.ColorId);
                return CreatedAtAction(nameof(GetNailService), new { id }, addedColor);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        /// <summary>
        /// Update color quantity in a nail service
        /// </summary>
        [HttpPut("{serviceId}/colors/{colorId}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateServiceColorQuantity(int serviceId, int colorId, [FromBody] int quantity)
        {
            try
            {
                await _nailServiceService.UpdateServiceColorQuantityAsync(serviceId, colorId, quantity);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        /// <summary>
        /// Remove a color from a nail service
        /// </summary>
        [HttpDelete("{serviceId}/colors/{colorId}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> RemoveServiceColor(int serviceId, int colorId)
        {
            try
            {
                await _nailServiceService.RemoveColorFromServiceAsync(serviceId, colorId);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
} 