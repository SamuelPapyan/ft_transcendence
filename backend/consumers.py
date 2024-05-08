import json
from channels.generic.websocket import WebsocketConsumer
from django.contrib.auth import get_user_model
from .view_models import Waiter, WaitingRoom, WaitingRoomMananger, normal

class MatchMaking(WebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.channel_name = "matchmaking"
        self.group_name = "matchmaking"

    def connect(self):
        user = self.scope["user"]

        if user.is_anonymous or not user.is_authenticated:
            return
        
        self.channel_layer.group_add(self.group_name, self.channel_name)

        self.room_name = int(self.scope['url_route']['kwargs']['room_name'])
        self.group_name = self.room_name

        waiting_room = normal.get(self.room_name)
        waiting_room.append(Waiter(user.username, self))

        self.send(json.dumps({
            "detail": "The gameheroes"
        }))

        waiting_room.broadcast()