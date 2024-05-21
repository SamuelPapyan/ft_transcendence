from channels.generic.websocket import WebsocketConsumer
from backend.room_classes.ChatRoomClasses import ChatMember
from backend.room_classes.ChatRoomClasses import ChatRoom
from backend.room_classes.ChatRoomClasses import ChatRoomManager
import json
import datetime
from backend.models import Channel, Message, User
from django.core.serializers.json import DjangoJSONEncoder

def default(o):
    if isinstance(o, (datetime.date, datetime.datetime)):
        return o.isoformat()

class ChatConsumer(WebsocketConsumer):
    room_manager = ChatRoomManager()
    
    def connect(self):
        print("Chat Connect:", ChatConsumer.room_manager.rooms)
        self.accept()
    
    def receive(self, text_data=None, bytes_data=None):
        obj = json.loads(text_data)
        print(obj)
        if obj["type"] == 'dms':
            dm_chats = []
            u = User.objects.get(username=obj["user"])
            channels = list(Channel.objects.filter(users=u, is_dm=True))
            for channel in channels:
                msgs = []
                users = list(channel.users.get_queryset())
                dm_name = users[0].username if users[0].username != obj["user"] else users[1].username
                messages = list(channel.messages.get_queryset())
                for msg in messages:
                    msgs.append({
                        "sender": msg.sender.username,
                        "content": msg.content,
                        "date": msg.date
                    })
                dm_chats.append({
                    "dm_name": dm_name,
                    "messages": msgs
                })
            self.send(text_data=json.dumps({
                "type": "dms",
                "dm_chats": dm_chats
            }, cls=DjangoJSONEncoder))
        elif obj["type"] == 'connect':
            print(ChatConsumer.room_manager.rooms)
            room: ChatRoom = ChatConsumer.room_manager.find_by_dm(obj["dm_user"], obj["user"])
            if room is not None:
                room.append(ChatMember(obj["user"], self))
            else:
                print('Creating Room')
                room = ChatRoom(dm=obj["dm"])
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
                
    def disconnect(self, code):
        print("Disconnect from Chat")