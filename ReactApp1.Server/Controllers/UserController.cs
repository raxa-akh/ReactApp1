using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Models;

namespace ReactApp1.Server.Controllers;

[Authorize(Roles = "Admin")]
[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly AppDbContext _context;

    public UserController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/user
    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        return await _context.Users.ToListAsync();
    }

    // PUT: api/user/block/5
    [HttpPut("block/{id}")]
    public async Task<IActionResult> BlockUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        user.IsBlocked = true;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // PUT: api/user/unblock/5
    [HttpPut("unblock/{id}")]
    public async Task<IActionResult> UnblockUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        user.IsBlocked = false;
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
