class AbstractRoom:
    def __init__(self):
        self.members = []

    def broadcast(self, data = {}):
        for member in self.members:
            member.send(data)

    def clear(self):
        for member in self.members:
            self.remove(member)
    
    def get_member(self, username):
        for member in self.members:
            if member.username == username:
                return member
        return None
    
    def append(self, member):
        self.members.append(member)
        member.accept()

    def remove(self, member, code = 1000):
        self.members.remove(member)
        member.disconnect(code)

    def empty(self):
        for _ in self.members:
            return False
        return True
    
    def get_username(self):
        return [member.username for member in self.members]
    
    def __len__(self):
        return len(self.members)