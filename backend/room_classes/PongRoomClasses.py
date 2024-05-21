from ft_transcendence.abstract.AbstractRoom import AbstractRoom
from ft_transcendence.abstract.AbstractRoomManager import AbstractRoomManager
from ft_transcendence.abstract.AbstractRoomMember import AbstractRoomMember
from backend.models import User, Match
from django.db.models import Q
from datetime import datetime

class Player(AbstractRoomMember):
    pass

class PongRoom(AbstractRoom):
    def __init__(self):
        super().__init__()
        self.winner = None
        self.game_data = {
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


    def save_match(self):
        p1 = User.objects.get(username=self.usernames()[0])
        p2 = User.objects.get(username=self.usernames()[1])
        m = Match.objects.get(Q(p1=p1) | Q(p1=p2), is_ongoing=True)
        w = User.objects.get(username=self.winner)
        m.p1_score = self.game_data["p1_score"]
        m.p2_score = self.game_data["p2_score"]
        m.winner = w
        m.end = datetime.now()
        m.is_ongoing = False
        m.save()

    def append(self, player):
        tmp = self.get_member(player.username)
        if tmp is not None:
            tmp.send({
                "method": "refuse",
                "user": player.username,
            })
            self.remove(tmp)
            return True
        p = User.objects.get(username=player.username)
        m = Match.objects.get(Q(p1=p) | Q(p2=p), is_ongoing=True)
        if m.p1 == p:
            self.members.insert(0, player)
        else:
            self.members.append(player)
        return False
    
    def read_frame(self):
        if (self.game_data["game_on"]):
            # P1 Goal
            if (self.game_data["x"] + 400 - 10 + self.game_data["dx"]) > (800 - 10):
                self.game_data["p1_score"] += 1
                self.game_data["x"] = 0
                self.game_data["y"] = 0
            
            #P2 Goal
            if (self.game_data["x"] + 400 - 10 + self.game_data["dx"]) < 10:
                self.game_data["p2_score"] += 1
                self.game_data["x"] = 0
                self.game_data["y"] = 0
            
            # Floor/Ceiling Collision
            if (self.game_data["y"] + 250 - 10 + self.game_data["dy"] > 500 - 10) or (self.game_data["y"] + 250 - 10 + self.game_data["dy"] < 10):
                self.game_data["dy"] = -self.game_data["dy"]
            
            # P1 Collision
            if (self.game_data["y"] + 250 - 10 >= self.game_data["p1_y"]) and (self.game_data["y"] + 250 - 10 <= self.game_data["p1_y"] + 100 - 10) and (self.game_data["x"] + 400 - 10 + self.game_data["dx"] < 40 + 10):
                self.game_data["dx"] = -self.game_data["dx"]
            
            # P2 Collision
            if (self.game_data["y"] + 250 - 10 >= self.game_data["p2_y"]) and (self.game_data["y"] + 250 - 10 <= self.game_data["p2_y"] + 100 - 10) and (self.game_data["x"] + 400 - 10 + self.game_data["dx"] > 800 - 40 -10):
                self.game_data["dx"] = -self.game_data["dx"]
            
            # Common Movement
            self.game_data["x"] += self.game_data["dx"]
            self.game_data["y"] += self.game_data["dy"]

    def check_match(self):
        if (self.game_data["p1_score"] == 10 or self.game_data["p2_score"] == 10):
            self.game_data["game_on"] = False
            ps = self.usernames()
            if self.game_data["p1_score"] == 10:
                self.winner = ps[0]
            else:
                self.winner = ps[1]
            self.save_match()

    def clean_up(self):
        if (self.game_data["p1_score"] == 10 or self.game_data["p2_score"] == 10):
            self.clear()
            return True
        return False

class PongRoomManager(AbstractRoomManager):
    pass