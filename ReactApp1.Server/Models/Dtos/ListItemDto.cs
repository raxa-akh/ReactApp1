namespace ReactApp1.Server.Models.Dtos;

public class ListItemDto
{
    public int Id { get; set; }
    public string? ProductName { get; set; }
    public string? CustomName { get; set; }
    public int Quantity { get; set; }
    public bool IsBought { get; set; }
}
