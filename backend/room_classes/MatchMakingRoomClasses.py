from ft_transcendence.abstract.AbstractRoom import AbstractRoom
from ft_transcendence.abstract.AbstractRoomManager import AbstractRoomManager
from ft_transcendence.abstract.AbstractRoomMember import AbstractRoomMember
from backend.models import User, Match
from datetime import datetime

class Waiter(AbstractRoomMember):
    pass

class WaitingRoom(AbstractRoom):
    def __init__(self):
        super().__init__()

    def create_match(self):
        p1 = User.objects.get(username=self.members[0].username)
        p2 = User.objects.get(username=self.members[1].username)
        match = Match(
            p1 = p1,
            p2 = p2,
            start = datetime.now()
        )
        match.save()

    def append(self, waiter):
        tmp = self.get_member(waiter.username)
        if tmp is not None:
            tmp.send({
                "method": "refuse",
                "user": waiter.username,
            })
            self.remove(tmp)
            return True
        self.members.append(waiter)
        return False

class WaitingRoomManager(AbstractRoomManager):
    pass