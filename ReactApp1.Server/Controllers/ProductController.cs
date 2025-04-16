using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Models;

using Microsoft.AspNetCore.Authorization;
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
    public async Task<ActionResult<IEnumerable<Product>>> GetMyProducts()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        return await _context.Products.Where(p => p.CreatedById == userId).ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Product>> Create(Product product)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        product.CreatedById = userId;

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return Ok(product);
    }
}