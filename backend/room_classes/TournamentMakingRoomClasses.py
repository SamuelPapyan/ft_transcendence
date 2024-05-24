from backend.models import User, Match
from ft_transcendence.abstract.AbstractRoom import AbstractRoom
from ft_transcendence.abstract.AbstractRoomManager import AbstractRoomManager
from ft_transcendence.abstract.AbstractRoomMember import AbstractRoomMember
from datetime import datetime

class Waiter(AbstractRoomMember):
    pass

class WaitingRoom(AbstractRoom):
    def __init__(self):
        super().__init__()

    def append(self, waiter):
        tmp = self.get_member(waiter.username)
        if tmp is not None:
            tmp.send({
                "method": "refuse",
                "user": waiter.username,
            })
            return True
        self.members.append(waiter)
        return False
    
    def create_tournament(self):
        p1 = User.objects.get(username=self.members[0].username)
        p2 = User.objects.get(username=self.members[1].username)
        p3 = User.objects.get(username=self.members[2].username)
        p4 = User.objects.get(username=self.members[3].username)
        m1 = Match(
            p1 = p1,
            p2 = p2,
            start = datetime.now(),
            is_tournament = True
        )
        m2 = Match(
            p1 = p3,
            p2 = p4,
            start = datetime.now(),
            is_tournament = True
        )
        m1.save()
        m2.save()
        m1.awaiting_players.set([p3, p4])
        m2.awaiting_players.set([p1, p2])
        m1.save()
        m2.save()

class WaitingRoomManager(AbstractRoomManager):
    pass