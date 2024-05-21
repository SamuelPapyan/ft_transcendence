class AbstractRoomManager:
    def __init__(self):
        self.rooms = []

    def remove(self, room):
        room.clear()
        self.rooms.remove(room)

    def append(self, room):
        self.rooms.append(room)

    def get(self):
        if len(self.rooms) > 0:
            return self.rooms[len(self.rooms) - 1]
        return None
    
    def find_by_username(self, username):
        for room in self.rooms:
            mem = room.get_member(username)
            if mem is not None:
                return room
        return None