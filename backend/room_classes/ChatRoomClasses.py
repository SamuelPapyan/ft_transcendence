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
        self.chat_id = -1

    def send_message(self, data):
        if data["dm"]:
            u1 = User.objects.get(username=data["user"])
            u2 = User.objects.get(username=data["dm_user"])
            c = Channel.objects.filter(is_dm=True, users=u1).get(users=u2)
            m = Message(sender = u1, content=data["content"], date=datetime.now())
            if "invitation" in data:
                m.is_invitation = True
            m.save()
            c.messages.set([*[*c.messages.get_queryset()], m])
            c.save()
            self.broadcast({
                "type": "send",
                "date": m.date,
                "sender": data["user"],
                "avatar":m.sender.avatar,
                "content": data["content"],
                "dm_name": data["dm_user"],
                "invitation": "invitation" in data
            })
        else:
            sender = User.objects.get(username=data["user"])
            c = Channel.objects.get(id=data["group_id"])
            m = Message(sender=sender, content=data["content"], date=datetime.now())
            m.save()
            c.messages.set([*[*c.messages.get_queryset()], m])
            c.save()
            self.broadcast({
                "type": "send",
                "date": m.date,
                "sender": data["user"],
                "avatar": m.sender.avatar,
                "content": data["content"],
                "group_id": data["group_id"]
            })

class ChatRoomManager(AbstractRoomManager):
    def find_by_dm(self, dm_user, user):
        for room in self.rooms:
            if room.dm:
                if dm_user in room.usernames() or user in room.usernames():
                    return room
        return None
    
    def find_by_group_id(self, chat_id):
        for room in self.rooms:
            if room.chat_id == chat_id:
                return room
        return None