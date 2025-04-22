using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Models;
using ReactApp1.Server.Models.Dtos;
using System.Security.Claims;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class ShoppingListController : ControllerBase
{
    private readonly AppDbContext _context;

    public ShoppingListController(AppDbContext context)
    {
        _context = context;
    }

    // ✅ GET /api/shoppinglist
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ShoppingListDto>>> GetMyLists()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var lists = await _context.ShoppingLists
            .Where(l => l.OwnerId == userId)
            .Include(l => l.Items)
            .ThenInclude(i => i.Product)
            .ToListAsync();

        var result = lists.Select(l => new ShoppingListDto
        {
            Id = l.Id,
            Name = l.Name,
            CreatedAt = l.CreatedAt,
            Items = l.Items.Select(i => new ListItemDto
            {
                Id = i.Id,
                ProductName = i.Product?.Name,
                CustomName = i.CustomName,
                Quantity = i.Quantity,
                IsBought = i.IsBought
            }).ToList()
        });

        return Ok(result);
    }

    // ✅ GET /api/shoppinglist/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<ShoppingListDto>> GetList(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var list = await _context.ShoppingLists
            .Include(l => l.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(l => l.Id == id && l.OwnerId == userId);

        if (list == null) return NotFound();

        var result = new ShoppingListDto
        {
            Id = list.Id,
            Name = list.Name,
            CreatedAt = list.CreatedAt,
            Items = list.Items.Select(i => new ListItemDto
            {
                Id = i.Id,
                ProductName = i.Product?.Name,
                CustomName = i.CustomName,
                Quantity = i.Quantity,
                IsBought = i.IsBought
            }).ToList()
        };

        return Ok(result);
    }

    // ✅ POST /api/shoppinglist
    [HttpPost]
    public async Task<ActionResult<ShoppingListDto>> Create([FromBody] ShoppingListCreateDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var list = new ShoppingList
        {
            Name = dto.Name,
            OwnerId = userId,
            CreatedAt = DateTime.UtcNow
        };

        _context.ShoppingLists.Add(list);
        await _context.SaveChangesAsync();

        var result = new ShoppingListDto
        {
            Id = list.Id,
            Name = list.Name,
            CreatedAt = list.CreatedAt,
            Items = new List<ListItemDto>()
        };

        return CreatedAtAction(nameof(GetList), new { id = list.Id }, result);
    }

    // ✅ PUT /api/shoppinglist/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] ShoppingListCreateDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var list = await _context.ShoppingLists.FirstOrDefaultAsync(l => l.Id == id && l.OwnerId == userId);
        if (list == null) return NotFound();

        list.Name = dto.Name;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // ✅ DELETE /api/shoppinglist/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var list = await _context.ShoppingLists.FirstOrDefaultAsync(l => l.Id == id && l.OwnerId == userId);

        if (list == null) return NotFound();

        _context.ShoppingLists.Remove(list);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
