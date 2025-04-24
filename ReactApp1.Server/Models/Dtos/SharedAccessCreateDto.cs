namespace ReactApp1.Server.Models.Dtos;

public class SharedAccessCreateDto
{
    public int ListId { get; set; }
    public string TargetUsername { get; set; } = string.Empty;
}
