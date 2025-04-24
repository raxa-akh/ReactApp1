namespace ReactApp1.Server.Models.Dtos
{
    public class ListItemUpdateDto
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        public bool IsBought { get; set; }
        public string? CustomName { get; set; } 
    }
}
