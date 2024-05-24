from channels.generic.websocket import WebsocketConsumer
from backend.room_classes.PongRoomClasses import Player, PongRoom, pong_room_manager
import json
from backend.models import User, Match
from datetime import datetime

class PongConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def receive(self, text_data=None, bytes_data=None):
        obj = json.loads(text_data)
        if obj["method"] == 'connect':
            room: PongRoom = pong_room_manager.find(obj["user"])
            if room is not None and len(room) < 2:
                if room.tournament and room.winner is not None and room.winner == obj["user"]:
                    room.send_waiting(True, self)
                    return
                else:
                    same_user = room.append(Player(obj["user"], self), False)
                    if same_user:
                        return
            else:
                room = PongRoom()
                room.append(Player(obj["user"], self), False)
                pong_room_manager.append(room)
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
            room: PongRoom = pong_room_manager.find_by_username(obj["user"])
            if room is not None:
                mem = room.get_member(obj["user"])
                room.remove(mem)
                room.broadcast({
                    **obj,
                    "winner": room.winner,
                    "final_scores": [room.game_data["p1_score"], room.game_data["p2_score"]],
                    "game_data": room.game_data,
                    "members": room.usernames()
                })
                if room.empty() and not room.game_data["game_on"] and obj["user"] not in room.players:
                    pong_room_manager.remove(room)
        elif obj["method"] in ['game', 'move']:
            room: PongRoom = pong_room_manager.find_by_username(obj["user"])
            if room is not None:
                if obj["method"] == 'move':
                    if room.game_data["game_on"] and obj["user"] in room.usernames():
                        if room.usernames().index(obj["user"]) == 0:
                            room.game_data["p1_y"] += obj["movement"]
                        elif room.usernames().index(obj["user"]) == 1:
                            room.game_data["p2_y"] += obj["movement"]
                room.read_frame()
                is_tour = room.check_match(obj)
                if not is_tour:
                    room.broadcast({
                        **obj,
                        "winner": room.winner,
                        "final_scores": [room.game_data["p1_score"], room.game_data["p2_score"]],
                        "game_data": room.game_data,
                        "members": room.usernames()
                    })
                    game_over = room.clean_up()
                    if game_over:
                        pong_room_manager.remove(room)
        elif obj["method"] == 'next':
            room_1: PongRoom = pong_room_manager.find_by_username(obj["user"])
            room_2: PongRoom = pong_room_manager.find_by_username(obj["next_user"])
            if room_1 is not None and room_2 is not None:
                u1 = User.objects.get(username=obj["user"])
                u2 = User.objects.get(username=obj["next_user"])
                m = Match(
                    p1=u1,
                    p2=u2,
                    start=datetime.now()
                )
                m.save()
                room_1.broadcast({**obj})
                room_2.broadcast({**obj})
                pong_room_manager.remove(room_1)
                pong_room_manager.remove(room_2)

    
    def disconnect(self, code):
        print("Disconnect from Pong")