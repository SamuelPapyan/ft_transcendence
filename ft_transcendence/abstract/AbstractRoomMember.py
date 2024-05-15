from channels.generic.websocket import WebsocketConsumer

import json

class AbstractRoomMember:
    def __init__(self, username, socket) -> None:
        self.username = username
        self.socket = socket

    def send(self, data):
        self.socket.send(text_data=json.dumps(data))

    def accept(self):
        self.socket.accept()

    def disconnect(self, code = 1000):
        self.socket.disconnect(code)