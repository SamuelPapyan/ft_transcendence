from channels.generic.websocket import WebsocketConsumer

from .AbstractRoomMember import AbstractRoomMember

class AbstractRoom:
    def __init__(self, room_manager):
        self._member_list = []
        self.room_manager = room_manager

    def broadcast(self, detail, data = {}):
        for member in self._member_list:
            member.send(detail, data)

    def clear(self):
        self._member_list.clear()

    def get_member_by_socket(self, socket):
        for member in self._member_list:
            if member.socket is socket:
                return member
        return None
    
    def get_member_by_username(self, username):
        for member in self._member_list:
            if member.username == username:
                return member
        return None
    
    def append(self, member: AbstractRoomMember):
        self._member_list.append(member)
        member.accept()

    def remove(self, member, code = 1000):
        self._member_list.remove(member)
        member.disconnect(code)

    def empty(self):
        for _ in self._member_list:
            return False
        return True
    
    def get_username(self):
        return [member.username for member in self._member_list]
    
    def __len__(self):
        return len(self._member_list)