from channels.generic.websocket import WebsocketConsumer

import json
from django.core.serializers.json import DjangoJSONEncoder

class AbstractRoomMember:
    def __init__(self, username, socket, avatar=None) -> None:
        self.username = username
        self.socket = socket
        self.avatar = avatar

    def send(self, data):
        self.socket.send(text_data=json.dumps(data, cls=DjangoJSONEncoder))

    def accept(self):
        self.socket.accept()

    def disconnect(self, code = 1000):
        self.socket.disconnect(code)