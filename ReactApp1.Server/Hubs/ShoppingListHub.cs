using Microsoft.AspNetCore.SignalR;

namespace ReactApp1.Server.Hubs
{
    public class ShoppingListHub : Hub
    {
        public async Task JoinListGroup(int listId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"list-{listId}");
        }

        public async Task LeaveListGroup(int listId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"list-{listId}");
        }
    }
}
