using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Models;
using ReactApp1.Server.Models.Dtos;
using System.Security.Claims;

namespace ReactApp1.Server.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class ProductController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProductController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("my")]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetMyProducts()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var products = await _context.Products
            .Where(p => p.CreatedById == userId)
            .Include(p => p.Category)
            .ToListAsync();

        var result = products.Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            CategoryId = (int)p.CategoryId,
            CategoryName = p.Category?.Name ?? ""
        });

        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<ProductDto>> Create([FromBody] ProductCreateDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var product = new Product
        {
            Name = dto.Name,
            CategoryId = dto.CategoryId,
            CreatedById = userId
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        var category = await _context.ProductCategories.FindAsync(dto.CategoryId);

        var result = new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            CategoryId = (int)product.CategoryId,
            CategoryName = category?.Name ?? ""
        };

        return Ok(result);
    }
}
