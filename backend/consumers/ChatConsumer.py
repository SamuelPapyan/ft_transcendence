from channels.generic.websocket import WebsocketConsumer
from backend.room_classes.ChatRoomClasses import ChatMember
from backend.room_classes.ChatRoomClasses import ChatRoom
from backend.room_classes.ChatRoomClasses import ChatRoomManager
import json
from backend.models import Channel, User
from django.core.serializers.json import DjangoJSONEncoder
from django.db.models import Q

class ChatConsumer(WebsocketConsumer):
    room_manager = ChatRoomManager()
    
    def connect(self):
        self.accept()
    
    def receive(self, text_data=None, bytes_data=None):
        obj = json.loads(text_data)
        if obj["type"] == 'dms':
            dm_chats = []
            u = User.objects.get(username=obj["user"])
            channels = list(Channel.objects.filter(users=u, is_dm=True))
            for channel in channels:
                msgs = []
                users = list(channel.users.get_queryset())
                dm_name = users[0].username if users[0].username != obj["user"] else users[1].username
                avatar = users[0].avatar if users[0].username != obj["user"] else users[1].avatar
                messages = list(channel.messages.get_queryset())
                for msg in messages:
                    msgs.append({
                        "sender": msg.sender.username,
                        "avatar": msg.sender.avatar,
                        "content": msg.content,
                        "date": msg.date,
                        "invitation": msg.is_invitation
                    })
                dm_chats.append({
                    "dm_name": dm_name,
                    "messages": msgs,
                    "avatar": avatar
                })
            self.send(text_data=json.dumps({
                "type": "dms",
                "dm_chats": dm_chats
            }, cls=DjangoJSONEncoder))
        
        elif obj["type"] == "group chats":
            group_chats = []
            u = User.objects.get(username=obj["user"])
            channels = list(Channel.objects.filter(Q(owner=u) | Q(users=u), is_dm = False).distinct())
            for channel in channels:
                msgs = []
                group_chat_name = channel.channel_name
                messages = list(channel.messages.get_queryset())
                users = list(channel.users.get_queryset())
                chat_users = {user.username: {"blocked": False, "avatar": user.avatar} for user in users}
                for msg in messages:
                    msgs.append({
                        "sender": msg.sender.username,
                        "avatar": msg.sender.avatar,
                        "content": msg.content,
                        "date": msg.date
                    })
                blocked = list(channel.blocked.get_queryset())
                for member in users:
                    chat_users[member.username]["blocked"] = member in blocked
                group_chats.append({
                    "chat_id": channel.id,
                    "chat_owner": channel.owner.username,
                    "avatar": channel.owner.avatar,
                    "channel_name": group_chat_name,
                    "group_users": chat_users,
                    "messages": msgs
                })

            self.send(text_data=json.dumps({
                "type": "group chats",
                "group_chats": group_chats
            }, cls=DjangoJSONEncoder))
        
        elif obj["type"] == 'connect':
            if obj["dm"]:
                room: ChatRoom = ChatConsumer.room_manager.find_by_dm(obj["dm_user"], obj["user"])
                if room is not None:
                    if room.get_member(obj["user"]) is None:
                        room.append(ChatMember(obj["user"], self))
                else:
                    room = ChatRoom(dm=obj["dm"])
                    room.append(ChatMember(obj["user"], self))
                    ChatConsumer.room_manager.append(room)
                room.broadcast({
                    **obj
                })
            else:
                room: ChatRoom = ChatConsumer.room_manager.find_by_group_id(obj["group_id"])
                if room is not None:
                    if room.get_member(obj["user"]) is None:
                        room.append(ChatMember(obj["user"], self))
                else:
                    room = ChatRoom(dm=False)
                    room.chat_id = obj["group_id"]
                    room.append(ChatMember(obj["user"], self))
                    ChatConsumer.room_manager.append(room)
                room.broadcast({
                    **obj
                })
        elif obj["type"] == 'send':
            room: ChatRoom = ChatConsumer.room_manager.find_by_username(obj["user"])
            room.send_message(obj)
        elif obj["type"] == 'disconnect':
            room: ChatRoom = ChatConsumer.room_manager.find_by_username(obj["user"])
            if room is not None:
                mem: ChatMember = room.get_member(obj["user"])
                room.broadcast({
                    **obj,
                })
                room.remove(mem)
                if room.empty():
                    ChatConsumer.room_manager.remove(room)
        elif obj["type"] == "create group chat":
            owner = User.objects.get(username=obj["user"])
            members = [*User.objects.filter(id__in=obj["members_ids"])]
            c = Channel(
                owner = owner,
                channel_name = obj["gc_name"],
                is_dm=False,
            )
            c.save()
            c.users.set(members)
            c.save()
            self.send(json.dumps({
                **obj
            }))
        elif obj["type"] == "block":
            c = Channel.objects.get(id=obj["group_id"])
            u = User.objects.get(username=obj["target"])
            blocked = [*c.blocked.get_queryset()]
            if u in blocked:
                blocked.remove(u)
            else:
                blocked.append(u)
            c.blocked.set(blocked)
            c.save()
            room: ChatRoom = ChatConsumer.room_manager.find_by_group_id(obj["group_id"])
            if room is not None:
                room.broadcast({
                    **obj
                })


                
    def disconnect(self, code):
        pass