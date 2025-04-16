using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace ReactApp1.Server.Controllers;
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

    [HttpGet("{listId}")]
    public async Task<ActionResult<IEnumerable<ListItem>>> GetItems(int listId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var list = await _context.ShoppingLists.FindAsync(listId);
        if (list == null || list.OwnerId != userId) return Forbid();

        return await _context.ListItems
            .Where(i => i.ListId == listId)
            .Include(i => i.Product)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<ListItem>> CreateItem(ListItem item)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var list = await _context.ShoppingLists.FindAsync(item.ListId);
        if (list == null || list.OwnerId != userId) return Forbid();

        _context.ListItems.Add(item);
        await _context.SaveChangesAsync();

        return Ok(item);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateItem(int id, ListItem item)
    {
        if (id != item.Id) return BadRequest();

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var list = await _context.ShoppingLists.FindAsync(item.ListId);
        if (list == null || list.OwnerId != userId) return Forbid();

        _context.Entry(item).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

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
