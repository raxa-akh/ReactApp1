namespace ReactApp1.Server.Models
{

    public class ListItem
    {
        public int Id { get; set; }

        public int ListId { get; set; }
        public ShoppingList? List { get; set; }

        public int? ProductId { get; set; }
        public Product? Product { get; set; }

        public string? CustomName { get; set; }
        public int Quantity { get; set; }
        public bool IsBought { get; set; }
    }
}
