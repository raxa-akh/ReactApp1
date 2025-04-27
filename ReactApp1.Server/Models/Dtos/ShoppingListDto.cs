namespace ReactApp1.Server.Models.Dtos
{
    public class ShoppingListDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public DateTime CreatedAt { get; set; }
        public int OwnerId { get; set; }  
        public List<ListItemDto> Items { get; set; } = new();
    }
}
