namespace ReactApp1.Server.Models
{


    public class SharedAccess
    {

        public int Id { get; set; }

        public int ListId { get; set; }
        public ShoppingList List { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public string Status { get; set; } = "Pending";
    }
}