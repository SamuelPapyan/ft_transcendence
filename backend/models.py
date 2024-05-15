from django.db import models
from datetime import datetime
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager

class User(AbstractUser):
    MALE = 'Male'
    FEMALE = 'Female'
    GENDER_IN_CHOICES = [
        (MALE, 'Male'),
        (FEMALE, 'Female'),
    ]
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    full_name = models.CharField(max_length=255, null=True, blank=True)
    gender = models.CharField(max_length=6, choices=GENDER_IN_CHOICES, null=True, blank=True)
    country = models.CharField(max_length=120, null=True, blank=True)
    city = models.CharField(max_length=120, null=True, blank=True)
    two_factor = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.username

class Match(models.Model):
    p1 = models.ForeignKey(User, related_name='player_1', on_delete=models.CASCADE)
    p2 = models.ForeignKey(User, related_name='player_2', on_delete=models.CASCADE)
    p1_score = models.IntegerField(default=0)
    p2_score = models.IntegerField(default=0)
    start = models.DateTimeField(null=True)
    end = models.DateTimeField(null=True)
    winner = models.ForeignKey(User, related_name='winner_player', on_delete=models.CASCADE, null=True, blank=True)
    is_ongoing = models.BooleanField(default=True)


# class Message(models.Model):
#     content = models.CharField(max_length=255)
#     sender = models.ForeignKey(User, related_name='sender', on_delete=models.CASCADE)
#     date = models.DateTimeField(default=datetime.now())

# class Channel(models.Model):
#     channel_name = models.CharField(max_length=255)
#     owner = models.ForeignKey(User, related_name='owner',on_delete=models.CASCADE)
#     users = models.ManyToManyField(User)
#     messages = models.ManyToManyField(Message)

# class Chat(models.Model):
#     chat_name = models.CharField(max_length=255)
#     in_game = models.BooleanField(default=False)
#     channels = models.ManyToManyField(Channel)

# class DMChannel(Channel):
#     user1 = models.ForeignKey(User, related_name='user1', on_delete=models.CASCADE)
#     user2 = models.ForeignKey(User, related_name='user2', on_delete=models.CASCADE)