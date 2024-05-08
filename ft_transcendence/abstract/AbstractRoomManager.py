from .AbstractRoom import AbstractRoom

class AbstractRoomManager:
    def __init__(self):
        self._room_list = []

    def remove(self, room):
        self._room_list.remove(room)

    def append(self, room):
        self._room_list.append(room)