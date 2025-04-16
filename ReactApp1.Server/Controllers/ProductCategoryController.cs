using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Models;

using Microsoft.AspNetCore.Authorization;

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
    public async Task<ActionResult<IEnumerable<ProductCategory>>> GetCategories()
    {
        return await _context.ProductCategories.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<ProductCategory>> Create(ProductCategory category)
    {
        _context.ProductCategories.Add(category);
        await _context.SaveChangesAsync();

        return Ok(category);
    }
}

