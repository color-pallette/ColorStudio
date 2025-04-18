using Microsoft.AspNetCore.Mvc;
using ColorStudio.DataService.Interface.Services;
using ColorStudio.DataAccess.Interface.Entities;

namespace ColorStudio.WebApi.Controllers
{
[ApiController]
[Route("api/[controller]")]
public class ColorController : ControllerBase
{
    private readonly IColorService _colorService;

    public ColorController(IColorService colorService)
    {
        _colorService = colorService;
    }

        /// <summary>
        /// Get all colors
        /// </summary>
    [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<Color>), 200)]
    public async Task<IActionResult> GetColors()
    {
        var colors = await _colorService.GetAllColorsAsync();
        return Ok(colors);
    }

        /// <summary>
        /// Get a specific color by id
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(Color), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetColor(int id)
        {
            try
            {
                var color = await _colorService.GetColorByIdAsync(id);
                return Ok(color);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        /// <summary>
        /// Create a new color
        /// </summary>
    [HttpPost]
        [ProducesResponseType(typeof(Color), 201)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> CreateColor([FromBody] Color color)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var createdColor = await _colorService.CreateColorAsync(color);
                return CreatedAtAction(nameof(GetColor), new { id = createdColor.Id }, createdColor);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Update an existing color
        /// </summary>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(Color), 200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> UpdateColor(int id, [FromBody] Color color)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var updatedColor = await _colorService.UpdateColorAsync(id, color);
                return Ok(updatedColor);
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
        /// Delete a color
        /// </summary>
        [HttpDelete("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> DeleteColor(int id)
        {
            try
            {
                await _colorService.DeleteColorAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        // Image management endpoints
        [HttpPost("{id}/image")]
        [ProducesResponseType(typeof(Color), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> AddColorImage(int id, [FromForm] IFormFile image, [FromForm] string? imageTitle = null)
        {
            try
            {
                if (image == null || image.Length == 0)
                    return BadRequest("No image file provided.");

                // Generate unique filename
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
                var imagePath = Path.Combine("uploads", "colors", fileName);
                var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", imagePath);

                // Ensure directory exists
                Directory.CreateDirectory(Path.GetDirectoryName(fullPath));

                // Save the file
                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                var color = await _colorService.AddImageToColorAsync(id, imagePath, imageTitle);
                return Ok(color);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}/image")]
        [ProducesResponseType(typeof(Color), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateColorImage(int id, [FromForm] IFormFile image, [FromForm] string? imageTitle = null)
        {
            try
            {
                if (image == null || image.Length == 0)
                    return BadRequest("No image file provided.");

                var color = await _colorService.GetColorByIdAsync(id);

                // Delete old image if exists
                if (!string.IsNullOrEmpty(color.ImagePath))
                {
                    var oldImagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", color.ImagePath);
                    if (System.IO.File.Exists(oldImagePath))
                        System.IO.File.Delete(oldImagePath);
                }

                // Generate unique filename
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
                var imagePath = Path.Combine("uploads", "colors", fileName);
                var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", imagePath);

                // Ensure directory exists
                Directory.CreateDirectory(Path.GetDirectoryName(fullPath));

                // Save the file
                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                color = await _colorService.UpdateColorImageAsync(id, imagePath, imageTitle);
                return Ok(color);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpDelete("{id}/image")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> RemoveColorImage(int id)
        {
            try
            {
                var color = await _colorService.GetColorByIdAsync(id);

                // Delete physical file if exists
                if (!string.IsNullOrEmpty(color.ImagePath))
                {
                    var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", color.ImagePath);
                    if (System.IO.File.Exists(fullPath))
                        System.IO.File.Delete(fullPath);
                }

                await _colorService.RemoveColorImageAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
