namespace ReactApp1.Server.Models
{

    public class ProductCategory
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        public ICollection<Product> Products { get; set; }
    }
}