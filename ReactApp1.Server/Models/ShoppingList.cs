using Microsoft.AspNetCore.Authorization;
namespace ReactApp1.Server.Models
{

    public class ShoppingList
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }

        public int OwnerId { get; set; }
        public User Owner { get; set; }

        public ICollection<ListItem> Items { get; set; }
        public ICollection<SharedAccess> SharedUsers { get; set; }
    }
}