from ft_transcendence.abstract.AbstractRoom import AbstractRoom
from ft_transcendence.abstract.AbstractRoomManager import AbstractRoomManager
from ft_transcendence.abstract.AbstractRoomMember import AbstractRoomMember
from datetime import datetime
from backend.models import Channel, Message, User

class ChatMember(AbstractRoomMember):
    pass

class ChatRoom(AbstractRoom):
    def __init__(self, dm):
        super().__init__()
        self.dm = dm

    def send_message(self, data):
        u1 = User.objects.get(username=data["user"])
        u2 = User.objects.get(username=data["dm_user"])
        c = Channel.objects.filter(is_dm=True, users=u1).get(users=u2)
        m = Message(sender = u1, content=data["content"], date=datetime.now())
        m.save()
        c.messages.set([*[*c.messages.get_queryset()], m])
        c.save()
        self.broadcast({
            "type": "send",
            "date": m.date,
            "sender": data["user"],
            "content": data["content"]
        })

class ChatRoomManager(AbstractRoomManager):
    def find_by_dm(self, dm_user, user):
        for room in self.rooms:
            if room.dm:
                if dm_user in room.usernames() or user in room.usernames():
                    return room
        return None