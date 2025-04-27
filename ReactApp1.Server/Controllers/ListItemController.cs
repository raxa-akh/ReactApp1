using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Models.Dtos;
using ReactApp1.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using ReactApp1.Server.Hubs;
using System.Security.Claims;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class ListItemController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IHubContext<ShoppingListHub> _hubContext;

    public ListItemController(AppDbContext context, IHubContext<ShoppingListHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

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

    [HttpPost]
    public async Task<IActionResult> AddItem([FromBody] ListItemCreateDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        if (!await HasAccessToList(dto.ListId, userId))
            return Forbid();

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

        await _hubContext.Clients.Group($"list-{dto.ListId}").SendAsync("ListUpdated", dto.ListId);

        return Ok(new { item.Id });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateItem(int id, [FromBody] ListItemUpdateDto dto)
    {
        if (id != dto.Id) return BadRequest();

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var item = await _context.ListItems
            .Include(i => i.List)
            .FirstOrDefaultAsync(i => i.Id == id);

        if (item == null) return NotFound();

        if (!await HasAccessToList(item.ListId, userId))
            return Forbid();

        item.Quantity = dto.Quantity;
        item.IsBought = dto.IsBought;
        item.CustomName = dto.CustomName;

        await _context.SaveChangesAsync();

        await _hubContext.Clients.Group($"list-{item.ListId}").SendAsync("ListUpdated", item.ListId);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteItem(int id)
    {
        var item = await _context.ListItems
            .Include(i => i.List)
            .FirstOrDefaultAsync(i => i.Id == id);

        if (item == null) return NotFound();

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        if (!await HasAccessToList(item.ListId, userId))
            return Forbid();

        _context.ListItems.Remove(item);
        await _context.SaveChangesAsync();

        await _hubContext.Clients.Group($"list-{item.ListId}").SendAsync("ListUpdated", item.ListId);

        return NoContent();
    }

    private async Task<bool> HasAccessToList(int listId, int userId)
    {
        return await _context.ShoppingLists
            .Include(l => l.SharedUsers)
            .AnyAsync(l =>
                l.Id == listId &&
                (l.OwnerId == userId || l.SharedUsers.Any(sa => sa.UserId == userId)));
    }
}
