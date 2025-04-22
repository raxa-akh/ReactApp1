using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Models;
using ReactApp1.Server.Models.Dtos;

namespace ReactApp1.Server.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class ProductCategoryController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProductCategoryController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductCategoryDto>>> GetCategories()
    {
        var categories = await _context.ProductCategories.ToListAsync();

        var result = categories.Select(c => new ProductCategoryDto
        {
            Id = c.Id,
            Name = c.Name
        });

        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<ProductCategoryDto>> Create([FromBody] ProductCategoryDto dto)
    {
        var category = new ProductCategory
        {
            Name = dto.Name
        };

        _context.ProductCategories.Add(category);
        await _context.SaveChangesAsync();

        dto.Id = category.Id;
        return Ok(dto);
    }
}
