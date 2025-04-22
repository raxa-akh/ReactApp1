namespace ReactApp1.Server.Models.Dtos;

public class ProductCreateDto
{
    public string Name { get; set; } = string.Empty;
    public int CategoryId { get; set; }
}
