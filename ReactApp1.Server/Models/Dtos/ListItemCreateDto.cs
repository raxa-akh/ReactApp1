namespace ReactApp1.Server.Models.Dtos;

public class ListItemCreateDto
{
    public int ListId { get; set; }
    public int? ProductId { get; set; }
    public string? CustomName { get; set; }
    public int Quantity { get; set; } = 1;
}
