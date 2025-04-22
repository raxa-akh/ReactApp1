using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Models.Dtos;
using ReactApp1.Server.Models;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;


[Authorize]
[Route("api/[controller]")]
[ApiController]
public class ListItemController : ControllerBase
{
    private readonly AppDbContext _context;

    public ListItemController(AppDbContext context)
    {
        _context = context;
    }

    // ✅ GET /api/listitem/{listId}
    [HttpGet("{listId}")]
    public async Task<ActionResult<IEnumerable<ListItemDto>>> GetItems(int listId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var list = await _context.ShoppingLists.FindAsync(listId);
        if (list == null || list.OwnerId != userId) return Forbid();

        var items = await _context.ListItems
            .Where(i => i.ListId == listId)
            .Include(i => i.Product)
            .ToListAsync();

        var result = items.Select(i => new ListItemDto
        {
            Id = i.Id,
            ProductName = i.Product?.Name,
            CustomName = i.CustomName,
            Quantity = i.Quantity,
            IsBought = i.IsBought
        });

        return Ok(result);
    }

    // ✅ POST /api/listitem
    [HttpPost]
    public async Task<IActionResult> AddItem([FromBody] ListItemCreateDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var item = new ListItem
        {
            ListId = dto.ListId,
            ProductId = dto.ProductId,
            CustomName = dto.CustomName,
            Quantity = dto.Quantity,
            IsBought = false
        };

        _context.ListItems.Add(item);
        await _context.SaveChangesAsync();

        return Ok(new { item.Id });
    }

    // ✅ PUT /api/listitem/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateItem(int id, [FromBody] ListItemUpdateDto dto)
    {
        var item = await _context.ListItems.FindAsync(id);
        if (item == null) return NotFound();

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var list = await _context.ShoppingLists.FindAsync(item.ListId);
        if (list == null || list.OwnerId != userId) return Forbid();

        item.Quantity = dto.Quantity;
        item.CustomName = dto.CustomName;
        item.IsBought = dto.IsBought;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // ✅ DELETE /api/listitem/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteItem(int id)
    {
        var item = await _context.ListItems.FindAsync(id);
        if (item == null) return NotFound();

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var list = await _context.ShoppingLists.FindAsync(item.ListId);
        if (list == null || list.OwnerId != userId) return Forbid();

        _context.ListItems.Remove(item);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
