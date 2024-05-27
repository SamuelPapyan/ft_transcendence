from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import permissions, serializers, status
from backend.models import User, Channel, Message
from django.db.models import Q
from datetime import datetime

class ChatApiViews:
    @api_view(['GET'])
    @permission_classes((permissions.AllowAny, ))
    def ApiOverview(request):
        api_urls = {
            'Send DM Message': '/chat/dm',
            'Has DM Message With Someone': '/chat/dm',
        }
        return Response(api_urls)
    
    @api_view(['GET'])
    @permission_classes((permissions.IsAuthenticated, ))
    def has_dm_channel(request):
        data = request.query_params
        sender = User.objects.get(username=data["sender"])
        to = User.objects.get(username=data["to"])
        exists = Channel.objects.filter(
            users=sender,
            is_dm=True
        ).filter(users=to).exists()
        return Response({
            "success": True,
            "data": exists,
            "message": "Is there our DM channel?"
        }, status=status.HTTP_200_OK)
    
    @api_view(['POST'])
    @permission_classes((permissions.IsAuthenticated, ))
    def create_dm(request):
        data = request.data
        sender = User.objects.get(username=data["sender"])
        to = User.objects.get(username=data["to"])
        message = Message(
            sender=sender,
            content=data["content"],
            date=datetime.now()
        )
        message.save()
        channel = Channel(
            channel_name="",
            owner=None
        )
        channel.save()
        channel.users.set([sender, to])
        channel.messages.set([message])
        channel.save()
        return Response({
            "success": True,
            "data": channel.id,
            "message": "DM Created Successfully",
        }, status=status.HTTP_200_OK)