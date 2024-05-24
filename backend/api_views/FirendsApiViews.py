from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import permissions, serializers, status
from backend.models import User
from backend.serializers import UserSerializer, UserViewSerializer
from django.contrib.auth import get_user_model

class UserApiViews:
    @api_view(['GET'])
    @permission_classes((permissions.AllowAny,))
    def ApiOverview(request):
        api_urls = {
            
        }
    
        return Response(api_urls)

    @api_view(['POST'])
    @permission_classes((permissions.IsAuthenticated,))
    def send_friend_request(request):
        pass

    @api_view(['GET'])
    @permission_classes((permissions.IsAuthenticated,))
    def get_friend_requests(request):
        pass

    @api_view(['POST'])
    @permission_classes((permissions.IsAuthenticated,))
    def accept_friend_request(request):
        pass

    @api_view(['POST'])
    @permission_classes((permissions.IsAuthenticated, ))
    def reject_friend_request(request):
        pass

    @api_view(['GET'])
    @permission_classes((permissions.IsAuthenticated, ))
    def get_friends(request):
        pass

    @api_view(['DELETE'])
    @permission_classes((permissions.IsAuthenticated, ))
    def remove_friend(request):
        pass