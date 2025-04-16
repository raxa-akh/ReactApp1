namespace ReactApp1.Server.Models
{

    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        public int? CategoryId { get; set; }
        public ProductCategory? Category { get; set; }

        public int? CreatedById { get; set; }
        public User? CreatedBy { get; set; }

        public ICollection<ListItem> ListItems { get; set; }
    }
}