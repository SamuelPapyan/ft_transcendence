from channels.generic.websocket import WebsocketConsumer
from backend.room_classes.PongRoomClasses import Player, PongRoom, PongRoomManager
import json

class PongConsumer(WebsocketConsumer):
    room_manager = PongRoomManager()

    def connect(self):
        self.accept()
        print("Connect: ", PongConsumer.room_manager.rooms)

    def receive(self, text_data=None, bytes_data=None):
        obj = json.loads(text_data)
        if obj["method"] == 'connect':
            room: PongRoom = PongConsumer.room_manager.get()
            if room is not None and len(room) < 2:
                same_user = room.append(Player(obj["user"], self))
                if same_user:
                    return
            else:
                room = PongRoom()
                room.append(Player(obj["user"], self))
                PongConsumer.room_manager.append(room)
            if len(room) == 2:
                room.game_data["game_on"] = True
            room.broadcast({
                **obj,
                "winner": room.winner,
                "final_scores": [room.game_data["p1_score"], room.game_data["p2_score"]],
                "game_data": room.game_data,
                "members": room.usernames()
            })
        elif obj["method"] == 'disconnect':
            room: PongRoom = PongConsumer.room_manager.find_by_username(obj["user"])
            if room is not None:
                mem = room.get_member(obj["user"])
                room.remove(mem)
                room.game_data["game_on"] = False
                room.broadcast({
                    **obj,
                    "winner": room.winner,
                    "final_scores": [room.game_data["p1_score"], room.game_data["p2_score"]],
                    "game_data": room.game_data,
                    "members": room.usernames()
                })
                if room.empty():
                    PongConsumer.room_manager.remove(room)
        elif obj["method"] in ['game', 'move']:
            room: PongRoom = PongConsumer.room_manager.find_by_username(obj["user"])
            if room is not None:
                if obj["method"] == 'move':
                    if room.game_data["game_on"] and obj["user"] in room.usernames():
                        if room.usernames().index(obj["user"]) == 0:
                            room.game_data["p1_y"] += obj["movement"]
                        elif room.usernames().index(obj["user"]) == 1:
                            room.game_data["p2_y"] += obj["movement"]
                room.read_frame()
                room.check_match()
                room.broadcast({
                    **obj,
                    "winner": room.winner,
                    "final_scores": [room.game_data["p1_score"], room.game_data["p2_score"]],
                    "game_data": room.game_data,
                    "members": room.usernames()
                })
                game_over = room.clean_up()
                if game_over:
                    PongConsumer.room_manager.remove(room)
    
    def disconnect(self, code):
        print("Disconnect from Pong")
        print("Disconnect: ", PongConsumer.room_manager.rooms)