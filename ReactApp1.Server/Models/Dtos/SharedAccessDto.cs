namespace ReactApp1.Server.Models.Dtos;

public class SharedAccessDto
{
    public int Id { get; set; }
    public int ListId { get; set; }
    public int UserId { get; set; }
    public string Username { get; set; } = string.Empty;
}
