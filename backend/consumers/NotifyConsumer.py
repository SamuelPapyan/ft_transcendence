from channels.generic.websocket import WebsocketConsumer
import json

class NotifyUser:
    def __init__(self, username, socket):
        self.username = username
        self.socket = socket
    
    def send(self, data):
        self.socket.send(text_data=json.dumps(data))

class NotifyConsumer(WebsocketConsumer):
    users = []
    def connect(self):
        self.accept()

    def receive(self, text_data):
        obj = json.loads(text_data)
        if obj["method"] == "connect":
            user = self.find_by_username(obj["user"])
            if user is None:
                NotifyConsumer.users.append(NotifyUser(obj["user"], self))
        elif obj["method"] == "block":
            pass
        elif obj["method"] == "match":
            pass
        elif obj["method"] == "invite":
            pass
        elif obj["method"] == "disconnect":
            user = self.find_by_username(obj["user"])
            if user is not None:
                NotifyConsumer.users.remove(user)

    def disconnect(self, code):
        pass

    def find_by_username(self, username):
        for user in NotifyConsumer.users:
            if user.username == username:
                return user
        return None
    
    def broadcast(self, data):
        for user in NotifyConsumer.users:
            user.send(data)