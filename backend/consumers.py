import json
from channels.generic.websocket import WebsocketConsumer
from django.contrib.auth import get_user_model
from .view_models import Waiter, WaitingRoom, WaitingRoomMananger, normal

class MatchMaking(WebsocketConsumer):
    users = {}
    def connect(self):
        if len(MatchMaking.users) == 2:
            self.disconnect(1000)
        self.accept()

    def receive(self, text_data=None, bytes_data=None):
        print(MatchMaking.users)
        print(text_data, type(text_data))
        obj = json.loads(text_data)
        if obj["user"] in list(MatchMaking.users.keys()):
            self.close(1000)
        if obj["method"] == 'connect':
            MatchMaking.users[obj["user"]] = self
        elif obj["method"] == 'disconnect':
            del(MatchMaking.users[obj["user"]])
        for i in MatchMaking.users:
            MatchMaking.users[i].send(text_data=json.dumps({
                **obj,
                "members": list(MatchMaking.users.keys())
            }))

    def disconnect(self, close_code):
        print("Disconnect")
        # Called when the socket closes