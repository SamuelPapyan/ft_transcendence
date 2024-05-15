import json
from channels.generic.websocket import WebsocketConsumer
from django.contrib.auth import get_user_model
from .view_models import Waiter, WaitingRoom, WaitingRoomMananger, normal
from .models import Match, User
from datetime import datetime

class MatchMaking(WebsocketConsumer):
    users = {}
    def connect(self):
        if len(MatchMaking.users) == 2:
            self.disconnect(1000)
        self.accept()

    def create_match(self):
        p1 = User.objects.get(username=list(MatchMaking.users.keys())[0])
        p2 = User.objects.get(username=list(MatchMaking.users.keys())[1])
        match = Match(
            p1 = p1,
            p2 = p2,
            start = datetime.now()
        )
        match.save()

    def receive(self, text_data=None, bytes_data=None):
        print(MatchMaking.users)
        print(text_data, type(text_data))
        obj = json.loads(text_data)
        if obj["method"] == 'connect':
            if obj["user"] in list(MatchMaking.users.keys()):
                self.close(1000)
            MatchMaking.users[obj["user"]] = self
        elif obj["method"] == 'add':
            if obj["user"] == list(MatchMaking.users.keys())[0]:
                self.create_match()
        elif obj["method"] == 'disconnect':
            del(MatchMaking.users[obj["user"]])
        for i in MatchMaking.users:
            MatchMaking.users[i].send(text_data=json.dumps({
                **obj,
                "members": list(MatchMaking.users.keys())
            }))

    def disconnect(self, close_code):
        print("Disconnect")
        # Called when the socket closes

class PongConsumer(WebsocketConsumer):
    users = {}
    data = {
        "game_on": False,
        "x": 0,
        "y": 0,
        "p1_score": 0,
        "p2_score": 0,
        "p1_y": 200,
        "p2_y": 200,
        "dx": -1,
        "dy": -1,
    }
    def connect(self):
        if len(PongConsumer.users) == 2:
            self.disconnect(1000)
        self.accept()

    def reset_game_data(self):
        PongConsumer.data = {
            "game_on": False,
            "x": 0,
            "y": 0,
            "p1_score": 0,
            "p2_score": 0,
            "p1_y": 200,
            "p2_y": 200,
            "dx": -1,
            "dy": -1,
        }
    
    def read_frame(self):
        if (PongConsumer.data["game_on"]):
            # P1 Goal
            if (PongConsumer.data["x"] + 400 - 10 + PongConsumer.data["dx"]) > (800 - 10):
                PongConsumer.data["p1_score"] += 1
                PongConsumer.data["x"] = 0
                PongConsumer.data["y"] = 0
            
            #P2 Goal
            if (PongConsumer.data["x"] + 400 - 10 + PongConsumer.data["dx"]) < 10:
                PongConsumer.data["p2_score"] += 1
                PongConsumer.data["x"] = 0
                PongConsumer.data["y"] = 0
            
            # Floor/Ceiling Collision
            if (PongConsumer.data["y"] + 250 - 10 + PongConsumer.data["dy"] > 500 - 10) or (PongConsumer.data["y"] + 250 - 10 + PongConsumer.data["dy"] < 10):
                PongConsumer.data["dy"] = -PongConsumer.data["dy"]
            
            # P1 Collision
            if (PongConsumer.data["y"] + 250 - 10 >= PongConsumer.data["p1_y"]) and (PongConsumer.data["y"] + 250 - 10 <= PongConsumer.data["p1_y"] + 100 - 10) and (PongConsumer.data["x"] + 400 - 10 + PongConsumer.data["dx"] < 40 + 10):
                PongConsumer.data["dx"] = -PongConsumer.data["dx"]
            
            # P2 Collision
            if (PongConsumer.data["y"] + 250 - 10 >= PongConsumer.data["p2_y"]) and (PongConsumer.data["y"] + 250 - 10 <= PongConsumer.data["p2_y"] + 100 - 10) and (PongConsumer.data["x"] + 400 - 10 + PongConsumer.data["dx"] > 800 - 40 -10):
                PongConsumer.data["dx"] = -PongConsumer.data["dx"]
            
            # Common Movement
            PongConsumer.data["x"] += PongConsumer.data["dx"]
            PongConsumer.data["y"] += PongConsumer.data["dy"]

    def save_match(self, winner):
        p1 = User.objects.get(username=list(PongConsumer.users.keys())[0])
        winnerP = User.objects.get(username=winner)
        match = Match.objects.get(p1=p1, is_ongoing=True)
        match.p1_score = PongConsumer.data["p1_score"]
        match.p2_score = PongConsumer.data["p2_score"]
        match.end = datetime.now()
        match.winner = winnerP
        match.is_ongoing = False
        match.save()


    def receive(self, text_data=None, bytes_data=None):
        obj = json.loads(text_data)
        winner = None
        final_scores = [0, 0]
        if obj["method"] == 'connect':
            if obj["user"] in list(PongConsumer.users.keys()):
                self.close(1000)
            PongConsumer.users[obj["user"]] = self
            if len(PongConsumer.users) == 2:
                PongConsumer.data["game_on"] = True
        elif obj["method"] == 'disconnect':
            del(PongConsumer.users[obj["user"]])
            PongConsumer.data["game_on"] = False
        elif obj["method"] in ['game', 'move']:
            if obj["method"] == 'move':
                if PongConsumer.data["game_on"] and obj["user"] in list(PongConsumer.users.keys()):
                    if list(PongConsumer.users.keys()).index(obj["user"]) == 0:
                        PongConsumer.data["p1_y"] += obj["movement"]
                    elif list(PongConsumer.users.keys()).index(obj["user"]) == 1:
                        PongConsumer.data["p2_y"] += obj["movement"]
            self.read_frame()
        final_scores = [PongConsumer.data["p1_score"], PongConsumer.data["p2_score"]]
        if (PongConsumer.data["p1_score"] == 10 or PongConsumer.data["p2_score"] == 10):
                PongConsumer.data["game_on"] = False
                ps = list(PongConsumer.users.keys())
                if PongConsumer.data["p1_score"] == 10:
                    winner = ps[0]
                else:
                    winner = ps[1]
                self.save_match(winner)
                self.reset_game_data()
        for i in PongConsumer.users:
            PongConsumer.users[i].send(text_data=json.dumps({
                **obj,
                "winner": winner,
                "final_scores": final_scores,
                "game_data": PongConsumer.data,
                "members": list(PongConsumer.users.keys())
            }))
    
    def disconnect(self, code):
        print("Disconnect from Pong")