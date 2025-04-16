namespace ReactApp1.Server.Models
{

    public class User
    {
        public int Id { get; set; }

        public string Username { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        public bool IsAdmin { get; set; }

        public bool IsBlocked { get; set; }

        public ICollection<ShoppingList> ShoppingLists { get; set; }

        public ICollection<Product> Products { get; set; }

        public ICollection<SharedAccess> SharedAccesses { get; set; }
    }
}