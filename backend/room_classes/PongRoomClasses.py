from ft_transcendence.abstract.AbstractRoom import AbstractRoom
from ft_transcendence.abstract.AbstractRoomManager import AbstractRoomManager
from ft_transcendence.abstract.AbstractRoomMember import AbstractRoomMember
from backend.models import User, Match
from django.db.models import Q
from datetime import datetime

class PongRoomManager(AbstractRoomManager):
    def find(self, username):
        res = self.find_by_username(username)
        if res is None:
            for room in self.rooms:
                if username in room.players:
                    res = room
        return res
    
pong_room_manager = PongRoomManager()

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
        self.tournament = False
        self.awaiting_players = []
        self.players = []
        self.ps = None


    def save_match(self):
        p1 = User.objects.get(username=self.ps[0])
        p2 = User.objects.get(username=self.ps[1])
        if Match.objects.filter(Q(p1=p1) | Q(p1=p2), is_ongoing=True).exists():
            m = Match.objects.get(Q(p1=p1) | Q(p1=p2), is_ongoing=True)
            w = User.objects.get(username=self.winner)
            m.p1_score = self.game_data["p1_score"]
            m.p2_score = self.game_data["p2_score"]
            m.winner = w
            m.end = datetime.now()
            m.is_ongoing = False
            m.save()

    def send_waiting(self, append, socket):
        if append:
            self.append(Player(self.winner, socket), True)
        winner = self.get_member(self.winner)
        other_room: PongRoom = pong_room_manager.find(self.awaiting_players[0])
        if other_room is None:
            other_room = pong_room_manager.find(self.awaiting_players[1])
        if other_room.winner is not None and other_room.get_member(other_room.winner) is not None:
            other_player = other_room.get_member(other_room.winner)
            other_player.send({
                "method": "next_match",
                "user": other_player.username,
                "next_user": winner.username,
                "final_scores": [self.game_data["p1_score"], self.game_data["p2_score"]]
            })
            winner.send({
                "method": "next_match",
                "user": winner.username,
                "next_user": other_player.username,
                "final_scores": [self.game_data["p1_score"], self.game_data["p2_score"]]
            })
        else:
            winner.send({
                "method": "waiting",
                "user": winner.username,
                "final_scores": [self.game_data["p1_score"], self.game_data["p2_score"]]
            })

    def get_next_round(self):
        loser_list = [*filter(lambda x: x.username != self.winner, self.members)]
        if len(loser_list) > 0:
            loser = loser_list[0]
            loser.send({
                "method": "game",
                "user": loser.username,
                "winner": self.winner,
                "final_scores": [self.game_data["p1_score"], self.game_data["p2_score"]],
                "game_data": self.game_data,
                "members": self.usernames()
            })
            self.players.remove(loser.username)
            self.remove(loser)
        self.send_waiting(False, None)

    def append(self, player, winner):
        if winner:
            self.members.append(player)
        tmp = self.get_member(player.username)
        if tmp is not None:
            tmp.send({
                "method": "refuse",
                "user": player.username,
            })
            return True
        p = User.objects.get(username=player.username)
        if Match.objects.filter(Q(p1=p) | Q(p2=p), is_ongoing=True).exists():
            m = Match.objects.get(Q(p1=p) | Q(p2=p), is_ongoing=True)
            if m.p1 == p:
                self.members.insert(0, player)
            else:
                self.members.append(player)
            self.players = [m.p1.username, m.p2.username]
            self.ps = [*self.players]
            self.tournament = m.is_tournament
            if self.tournament:
                ap = [*m.awaiting_players.get_queryset()]
                self.awaiting_players = [x.username for x in ap]
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

    def check_match(self, obj):
        if (self.game_data["p1_score"] == 10 or self.game_data["p2_score"] == 10):
            self.game_data["game_on"] = False
            if self.game_data["p1_score"] == 10:
                self.winner = self.ps[0]
            else:
                self.winner = self.ps[1]
            self.save_match()
            if self.tournament:
                self.get_next_round()
                return True
            else:
                p1 = User.objects.get(username=self.ps[0])
                p2 = User.objects.get(username=self.ps[1])
                if Match.objects.filter(winner=p1, is_tournament=True).exists() and Match.objects.filter(winner=p2, is_tournament=True).exists():
                    m1 = Match.objects.get(winner=p1, is_tournament=True)
                    m2 = Match.objects.get(winner=p2, is_tournament=True)
                    m1.is_tournament = False
                    m2.is_tournament = False
                    m1.save()
                    m2.save()
            return self.tournament
        return False

    def clean_up(self):
        if (self.game_data["p1_score"] == 10 or self.game_data["p2_score"] == 10):
            self.clear()
            return True
        return False