namespace ReactApp1.Server.Models.Dtos;

public class ShoppingListDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    public List<ListItemDto> Items { get; set; } = new();
}
