from ft_transcendence.abstract.AbstractRoom import AbstractRoom
from ft_transcendence.abstract.AbstractRoomManager import AbstractRoomManager
from ft_transcendence.abstract.AbstractRoomMember import AbstractRoomMember

class Waiter(AbstractRoomMember):
    pass

class WaitingRoom(AbstractRoom):
    def __init__(self, room_manager, room_name):
        super().__init__(room_manager)
        self.room_name = room_name

    def append(self, waiter):
        tmp = self.get_member_by_username(waiter.username)
        if tmp is not None:
            tmp.send("Connection close: Another connection open with the same username.")
            self.remove(tmp)
        waiter.accept()
        self._member_list.append(waiter)

class WaitingRoomMananger(AbstractRoomManager):
    def get(self, room_name):
        for waiting_room in self._room_list:
            if waiting_room.room_name == room_name:
                return waiting_room
        tmp = WaitingRoom(self, room_name)
        super().append(tmp)
        return tmp

normal = WaitingRoomMananger()