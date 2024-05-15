from ft_transcendence.abstract.AbstractRoom import AbstractRoom
from ft_transcendence.abstract.AbstractRoomManager import AbstractRoomManager
from ft_transcendence.abstract.AbstractRoomMember import AbstractRoomMember

class Waiter(AbstractRoomMember):
    pass

class WaitingRoom(AbstractRoom):
    def __init__(self):
        super().__init__()

    def append(self, waiter):
        tmp = self.get_member(waiter.username)
        if tmp is not None:
            tmp.send("Connection close: Another connection open with the same username.")
            self.remove(tmp)
        waiter.accept()
        self._member_list.append(waiter)

class WaitingRoomMananger(AbstractRoomManager):
    pass

normal = WaitingRoomMananger()