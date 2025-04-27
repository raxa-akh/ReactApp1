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
public class ShoppingListController : ControllerBase
{
    private readonly AppDbContext _context;

    public ShoppingListController(AppDbContext context)
    {
        _context = context;
    }

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

    [HttpGet("shared")]
    public async Task<ActionResult<IEnumerable<ShoppingListDto>>> GetSharedLists()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var lists = await _context.SharedAccesses
            .Where(sa => sa.UserId == userId)
            .Include(sa => sa.List)
                .ThenInclude(l => l.Items)
                    .ThenInclude(i => i.Product)
            .Select(sa => sa.List)
            .ToListAsync();

        var result = lists.Select(list => new ShoppingListDto
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
        });

        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ShoppingListDto>> GetList(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var list = await _context.ShoppingLists
            .Include(l => l.Items).ThenInclude(i => i.Product)
            .Include(l => l.SharedUsers)
            .FirstOrDefaultAsync(l => l.Id == id);

        if (list == null)
            return NotFound();

        var hasAccess = list.OwnerId == userId || list.SharedUsers.Any(s => s.UserId == userId);
        if (!hasAccess)
            return Forbid();

        var result = new ShoppingListDto
        {
            Id = list.Id,
            Name = list.Name,
            CreatedAt = list.CreatedAt,
            OwnerId = list.OwnerId,
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

    [HttpGet("{listId}/access")]
    public async Task<ActionResult<IEnumerable<object>>> GetAccessList(int listId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var list = await _context.ShoppingLists
            .Include(l => l.SharedUsers)
            .ThenInclude(sa => sa.User)
            .FirstOrDefaultAsync(l => l.Id == listId);

        if (list == null || list.OwnerId != userId)
            return Forbid();

        var result = list.SharedUsers.Select(sa => new
        {
            id = sa.Id,
            username = sa.User.Username
        });

        return Ok(result);
    }

    [HttpPost("{listId}/access")]
    public async Task<IActionResult> GrantAccess(int listId, [FromBody] GrantAccessDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var list = await _context.ShoppingLists.FirstOrDefaultAsync(l => l.Id == listId);
        if (list == null || list.OwnerId != userId)
            return Forbid();

        var targetUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == dto.TargetUsername);
        if (targetUser == null)
            return NotFound("Пользователь не найден");

        var exists = await _context.SharedAccesses
            .AnyAsync(sa => sa.ListId == listId && sa.UserId == targetUser.Id);
        if (exists)
            return BadRequest("Уже есть доступ");

        _context.SharedAccesses.Add(new SharedAccess
        {
            ListId = listId,
            UserId = targetUser.Id
        });

        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpDelete("{listId}/access/{accessId}")]
    public async Task<IActionResult> RevokeAccess(int listId, int accessId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var list = await _context.ShoppingLists
            .FirstOrDefaultAsync(l => l.Id == listId);
        if (list == null || list.OwnerId != userId)
            return Forbid();

        var access = await _context.SharedAccesses.FirstOrDefaultAsync(sa => sa.Id == accessId && sa.ListId == listId);
        if (access == null)
            return NotFound();

        _context.SharedAccesses.Remove(access);
        await _context.SaveChangesAsync();

        return NoContent();
    }


}
