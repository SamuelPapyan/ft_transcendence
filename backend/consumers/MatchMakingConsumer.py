import json
from channels.generic.websocket import WebsocketConsumer
from backend.room_classes.MatchMakingRoomClasses import Waiter, WaitingRoom, WaitingRoomManager

class MatchMakingConsumer(WebsocketConsumer):
    room_manager = WaitingRoomManager()
    def connect(self):
        self.accept()

    def receive(self, text_data=None, bytes_data=None):
        obj = json.loads(text_data)
        if obj["method"] == 'connect':
            room: WaitingRoom = MatchMakingConsumer.room_manager.get()
            if room is not None and len(room) < 2:
                same_user = room.append(Waiter(obj["user"], self))
                if same_user:
                    return
            else:
                room = WaitingRoom()
                room.append(Waiter(obj["user"], self))
                MatchMakingConsumer.room_manager.append(room)
            room.broadcast({
                **obj,
                "members": room.usernames(),
                "avatars": room.avatars()
            })
        elif obj["method"] == 'add':
            room: WaitingRoom = MatchMakingConsumer.room_manager.find_by_username(obj["user"])
            room.create_match()
            room.broadcast({
                **obj,
                "members": room.usernames(),
                "avatars": room.avatars()
            })
        elif obj["method"] == 'disconnect':
            room: WaitingRoom = MatchMakingConsumer.room_manager.find_by_username(obj["user"])
            mem = room.get_member(obj["user"])
            room.remove(mem)
            room.broadcast({
                **obj,
                "members": room.usernames(),
                "avatars": room.avatars()
            })
            if room.empty():
                MatchMakingConsumer.room_manager.remove(room)

    def disconnect(self, close_code):
        pass