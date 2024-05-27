import json
from channels.generic.websocket import WebsocketConsumer
from backend.room_classes.TournamentMakingRoomClasses import Waiter, WaitingRoom, WaitingRoomManager

class TournamentMakingConsumer(WebsocketConsumer):
    room_manager = WaitingRoomManager()
    def connect(self):
        self.accept()

    def receive(self, text_data=None, bytes_data=None):
        obj = json.loads(text_data)
        if obj["method"] == 'connect':
            room: WaitingRoom = TournamentMakingConsumer.room_manager.get()
            if room is not None and len(room) < 4:
                same_user = room.append(Waiter(obj["user"], self))
                if same_user:
                    return
            else:
                room = WaitingRoom()
                room.append(Waiter(obj["user"], self))
                TournamentMakingConsumer.room_manager.append(room)
            room.broadcast({
                **obj,
                "members": room.usernames(),
                "avatars": room.avatars()
            })
        elif obj["method"] == 'start':
            room: WaitingRoom = TournamentMakingConsumer.room_manager.find_by_username(obj["user"])
            room.create_tournament()
            room.broadcast({
                **obj,
                "members": room.usernames(),
                "avatars": room.avatars()
            })
            TournamentMakingConsumer.room_manager.remove(room)
        elif obj["method"] == "disconnect":
            room: WaitingRoom = TournamentMakingConsumer.room_manager.find_by_username(obj["user"])
            if room is not None:
                mem = room.get_member(obj["user"])
                room.remove(mem)
                room.broadcast({
                    **obj,
                    "members": room.usernames(),
                    "avatars": room.avatars()
                })
                if room.empty():
                    TournamentMakingConsumer.room_manager.remove(room)

    def disconnect(self, code):
        pass