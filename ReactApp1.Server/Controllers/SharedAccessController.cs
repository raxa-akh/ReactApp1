using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace ReactApp1.Server.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class SharedAccessController : ControllerBase
{
    private readonly AppDbContext _context;

    public SharedAccessController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("list/{listId}")]
    public async Task<ActionResult<IEnumerable<SharedAccess>>> GetAccesses(int listId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var list = await _context.ShoppingLists.FindAsync(listId);
        if (list == null || list.OwnerId != userId) return Forbid();

        return await _context.SharedAccesses
            .Where(s => s.ListId == listId)
            .Include(s => s.User)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<SharedAccess>> GrantAccess(SharedAccess access)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var list = await _context.ShoppingLists.FindAsync(access.ListId);
        if (list == null || list.OwnerId != userId) return Forbid();

        _context.SharedAccesses.Add(access);
        await _context.SaveChangesAsync();

        return Ok(access);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> RevokeAccess(int id)
    {
        var access = await _context.SharedAccesses.FindAsync(id);
        if (access == null) return NotFound();

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var list = await _context.ShoppingLists.FindAsync(access.ListId);
        if (list == null || list.OwnerId != userId) return Forbid();

        _context.SharedAccesses.Remove(access);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
