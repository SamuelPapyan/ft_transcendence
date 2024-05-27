from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import permissions, status
from backend.models import User
from friendship.models import Friend, FriendshipRequest

class FriendsApiView:
    @api_view(['GET'])
    @permission_classes((permissions.AllowAny,))
    def ApiOverview(request):
        api_urls = {
            
        }
    
        return Response(api_urls)

    @api_view(['POST'])
    @permission_classes((permissions.IsAuthenticated,))
    def send_friend_request(request):
        data = request.data
        user = User.objects.get(username=data["user"])
        other_user = User.objects.get(username=data["other_user"])
        if (FriendshipRequest.objects.filter(from_user=other_user, to_user=user).exists() or 
            FriendshipRequest.objects.filter(from_user=user, to_user=other_user).exists()):
            return Response({
            "success": False,
            "data": None,
            "message": "Already Requested"
        }, status=status.HTTP_200_OK)
        if Friend.objects.filter(from_user=other_user, to_user=user).exists():
            return Response({
            "success": False,
            "data": None,
            "message": "Already Friends"
        }, status=status.HTTP_404_NOT_FOUND)
        Friend.objects.add_friend(user, other_user, message="Hi")
        return Response({
            "success": True,
            "data": "",
            "message": "Sent succesfully"
        }, status=status.HTTP_200_OK)


    @api_view(['GET'])
    @permission_classes((permissions.IsAuthenticated,))
    def get_friend_requests(request, username):
        user = User.objects.get(username=username)
        frs = Friend.objects.unread_requests(user=user)
        frs_dirs = []
        for fr in frs:
            frs_dirs.append({
                "from": fr.from_user.username,
                "to": fr.to_user.username,
                "created": fr.created.strftime("%d/%m/%Y | %H:%M:%S"),
                "rejected": fr.rejected is not None
            })
        return Response({
            "success": True,
            "data": frs_dirs,
            "message": "Friend Requests."
        }, status=status.HTTP_200_OK)
    
    @api_view(['GET'])
    @permission_classes((permissions.IsAuthenticated,))
    def get_sent_requests(request, username):
        user = User.objects.get(username=username)
        frs = Friend.objects.sent_requests(user=user)
        frs_dirs = []
        for fr in frs:
            frs_dirs.append({
                "from": fr.from_user.username,
                "to": fr.to_user.username,
                "created": fr.created.strftime("%d/%m/%Y | %H:%M:%S"),
                "rejected": fr.rejected is not None
            })
        return Response({
            "success": True,
            "data": frs_dirs,
            "message": "Sent Requests!"
        }, status=status.HTTP_200_OK)

    @api_view(['POST'])
    @permission_classes((permissions.IsAuthenticated,))
    def accept_friend_request(request):
        data = request.data
        to_user = User.objects.get(username=data["user"])
        from_user = User.objects.get(username=data["other_user"])
        friend_request = FriendshipRequest.objects.get(from_user=from_user, to_user=to_user)
        friend_request.accept()
        return Response({
            "success": True,
            "data": "",
            "message": "Accepted succesfully"
        }, status=status.HTTP_200_OK)

    @api_view(['POST'])
    @permission_classes((permissions.IsAuthenticated, ))
    def reject_friend_request(request):
        data = request.data
        to_user = User.objects.get(username=data["user"])
        from_user = User.objects.get(username=data["other_user"])
        friend_request = FriendshipRequest.objects.get(from_user=from_user, to_user=to_user)
        friend_request.reject()
        return Response({
            "success": True,
            "data": "",
            "message": "Rejected Successfuly"
        }, status=status.HTTP_200_OK)

    @api_view(['GET'])
    @permission_classes((permissions.IsAuthenticated, ))
    def get_friends(request, username):
        user = User.objects.get(username=username)
        friends = Friend.objects.filter(to_user=user)
        friends_dirs = []
        for friend in [*friends]:
            friends_dirs.append({
                "username": friend.from_user.username
            })
        return Response({
            "success": True,
            "data": friends_dirs,
            "message": "Friends!!"
        }, status=status.HTTP_200_OK)

    @api_view(['DELETE'])
    @permission_classes((permissions.IsAuthenticated, ))
    def remove_friend(request):
        data = request.data
        user = User.objects.get(username=data["user"])
        other_user = User.objects.get(username=data["other_user"])
        Friend.objects.remove_friend(user, other_user)
        return Response({
            "success": True,
            "data": "",
            "message": "Removed succesfully"
        }, status=status.HTTP_200_OK)