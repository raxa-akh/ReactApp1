using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Models;
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

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ShoppingList>>> GetMyLists()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        return await _context.ShoppingLists
            .Where(l => l.OwnerId == userId)
            .Include(l => l.Items)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ShoppingList>> GetList(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var list = await _context.ShoppingLists
            .Include(l => l.Items)
            .FirstOrDefaultAsync(l => l.Id == id && l.OwnerId == userId);

        if (list == null) return NotFound();

        return list;
    }

    [HttpPost]
    public async Task<ActionResult<ShoppingList>> Create(ShoppingList list)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        list.OwnerId = userId;
        list.CreatedAt = DateTime.UtcNow;

        _context.ShoppingLists.Add(list);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetList), new { id = list.Id }, list);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, ShoppingList list)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        if (id != list.Id || list.OwnerId != userId) return BadRequest();

        _context.Entry(list).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var list = await _context.ShoppingLists.FindAsync(id);

        if (list == null || list.OwnerId != userId) return NotFound();

        _context.ShoppingLists.Remove(list);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}