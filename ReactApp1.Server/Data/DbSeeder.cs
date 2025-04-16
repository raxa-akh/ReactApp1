using ReactApp1.Server.Models;
using System.Security.Cryptography;
using System.Text;

namespace ReactApp1.Server.Data;

public class DbSeeder
{
    public static void Seed(AppDbContext context)
    {
        if (context.Users.Any()) return; // уже есть данные

        string Hash(string password)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }

        // Пользователи
        var admin = new User
        {
            Username = "admin",
            Email = "admin@example.com",
            PasswordHash = Hash("admin123"),
            IsAdmin = true,
            IsBlocked = false
        };

        var user = new User
        {
            Username = "user1",
            Email = "user1@example.com",
            PasswordHash = Hash("user123"),
            IsAdmin = false,
            IsBlocked = false
        };

        context.Users.AddRange(admin, user);
        context.SaveChanges();

        // Категории
        var cat1 = new ProductCategory { Name = "Продукты" };
        var cat2 = new ProductCategory { Name = "Хозяйственные товары" };
        context.ProductCategories.AddRange(cat1, cat2);
        context.SaveChanges();

        // Товары
        var p1 = new Product { Name = "Хлеб", Category = cat1, CreatedById = admin.Id };
        var p2 = new Product { Name = "Молоко", Category = cat1, CreatedById = user.Id };
        var p3 = new Product { Name = "Мыло", Category = cat2, CreatedById = user.Id };

        context.Products.AddRange(p1, p2, p3);
        context.SaveChanges();
    }
}
