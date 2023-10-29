using Microsoft.AspNetCore.SignalR;

namespace ChatApp.Hub
{
    public class ChatHub:Microsoft.AspNetCore.SignalR.Hub
    {
        private readonly IDictionary<string, UserRoomConnection> _connection;

        public ChatHub(IDictionary<string, UserRoomConnection> connection)
        {
            _connection = connection;
        }

        public async Task JoinRoom(UserRoomConnection userConnection)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userConnection.Room!);
            _connection.Add(Context.ConnectionId, userConnection);
            await Clients.Group(userConnection.Room!).SendAsync("ReceiveMessage", $"{userConnection.User} has joined the room {userConnection.Room}");
        }

        public async Task SendMessage(string message)
        {
            if (_connection.TryGetValue(Context.ConnectionId, out var userConnection))
            {
                await Clients.Group(userConnection.Room!).SendAsync(method: "ReceiveMessage", arg1: userConnection.User, arg2: message, arg3: DateTime.Now);
            }            
        }
    }
}
