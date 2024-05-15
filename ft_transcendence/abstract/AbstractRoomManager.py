class AbstractRoomManager:
    def __init__(self):
        self.rooms = {}

    def remove(self, room_name):
        self.rooms[room_name].clear()
        del(self.rooms[room_name])

    def append(self, room_name, room):
        self.rooms[room_name] = room

    def get(self, room_name):
        if room_name in list(self.rooms.keys()):
            return self.rooms[room_name]
        return None