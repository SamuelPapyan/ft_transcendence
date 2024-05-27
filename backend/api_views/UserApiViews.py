from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import permissions, serializers, status
from backend.models import User, Match
from backend.serializers import UserSerializer, UserViewSerializer
from django.contrib.auth import get_user_model
from backend.authentication import JWTAuthentication
from django.db.models import Q
import base64

class UserApiViews:
    @api_view(['GET'])
    @permission_classes((permissions.AllowAny,))
    def ApiOverview(request):
        api_urls = {
            'all_items': '/users/all',
            'Search by Username': '/users/all/?username=user_name',
            'Search by Full Name': '/users/all/?full_name=fullname',
            'Add': '/users/create',
            'Update': 'users/<username>/update',
            'Delete': '/users/<username>/delete'
        }
    
        return Response(api_urls)

    @api_view(['POST'])
    @permission_classes((permissions.AllowAny,))
    def add_users(request):
        serialized = UserSerializer(data=request.data)
        UserModel = get_user_model()
        if serialized.is_valid():
            if UserModel.objects.filter(username=serialized.initial_data["username"]).exists():
                return Response({
                    "success": False,
                    "data": None,
                    "message": "This user already exists."
                }, status=status.HTTP_400_BAD_REQUEST)
        
            UserModel.objects.create_user(
                username=serialized.initial_data["username"],
                password=serialized.initial_data["password"]
            )
            return Response({
                    "success": True,
                    "data": serialized.data,
                    "message": "User created successfully."
                }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                    "success": False,
                    "data": None,
                    "message": serialized._errors
                }, status=status.HTTP_400_BAD_REQUEST)
        
    @api_view(['GET'])
    @permission_classes((permissions.AllowAny,))
    def view_users(request):
        if request.query_params:
            users = User.objects.filter(**request.query_params.dict())
        else:
            users = User.objects.all()

        if users:
            serializer = UserViewSerializer(users, many=True)
            for user in serializer.data:
                u = User.objects.get(username=user["username"])
                matches_wins = Match.objects.filter(Q(p1=u) | Q(p2=u)).filter(winner=u)
                matches_loss = Match.objects.filter(Q(p1=u) | Q(p2=u)).filter(~Q(winner=u))
                user["wins"] = len(matches_wins)
                user["loss"] = len(matches_loss)

            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
    @api_view(['POST'])
    @permission_classes((permissions.AllowAny,))
    def update_users(request, username):
        user = User.objects.get(username=username)
        data = UserSerializer(instance=user, data=request.data)

        if data.is_valid():
            data.save()
            return Response(data.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
    @api_view(['GET'])
    @permission_classes((permissions.AllowAny,))
    def get_user(request, username):
        if User.objects.filter(username=username).exists():
            user = User.objects.get(username=username)
            user_data = {
                "id": user.id,
                "username": user.username,
                "two_factor": user.two_factor,
                "email": user.email,
                "avatar": user.avatar
            }
            return Response(user_data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

        
    @api_view(['DELETE'])
    @permission_classes((permissions.AllowAny, ))
    def delete_items(request, username):
        if User.objects.filter(username=username).exists():
            item = User.objects.get(username=username)
            item.delete()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
    @api_view(['PUT'])
    @permission_classes((permissions.IsAuthenticated, ))
    def change_username(request):
        data = request.data
        user = User.objects.get(username=data["username"])
        new_username = data["new_username"]
        if User.objects.filter(username=new_username).exists():
            return Response({
                "success": False,
                "data": None,
                "message": "User with this username is already exists."
            }, status=status.HTTP_403_FORBIDDEN)
        user.username = new_username
        user.save()
        return Response({
                "success": True,
                "data": JWTAuthentication.create_jwt(user, False),
                "message": "Username changed succesfully."
            }, status=status.HTTP_200_OK)
    
    @api_view(['PUT'])
    @permission_classes((permissions.IsAuthenticated, ))
    def change_password(request):
        data = request.data
        user = User.objects.get(username=data["username"])
        password = data["password"]
        new_pass = data["new_pass"]
        if not user.check_password(password):
            return Response({
                "success": False,
                "data": None,
                "message": "The Wrong Password"
            }, status=status.HTTP_403_FORBIDDEN)
        user.set_password(new_pass)
        user.save()
        return Response({
                "success": True,
                "data": JWTAuthentication.create_jwt(user, False),
                "message": "Password changed succesfully."
            }, status=status.HTTP_200_OK)
    
    @api_view(['PUT'])
    @permission_classes((permissions.IsAuthenticated, ))
    def set_2fa(request):
        data = request.data
        user = User.objects.get(username=data["username"])
        user.two_factor = data["two_factor"]
        if (len(data["email"]) > 0):
            user.email = data["email"]
        user.save()
        return Response({
            "success": True,
            "data": "2FA",
            "message": "Started 2FA Authentication"
        }, status=status.HTTP_200_OK)
    
    @api_view(['PUT'])
    @permission_classes((permissions.IsAuthenticated, ))
    def verify_2fa(request):
        data = request.data
        user = User.objects.get(username=data["username"])
        return Response({
            "success": True,
            "data": JWTAuthentication.create_jwt(user, False),
            "message": "Started 2FA Authentication"
        }, status=status.HTTP_200_OK)
    
    @api_view(['POST'])
    @permission_classes((permissions.AllowAny, ))
    def login_42(request):
        data = request.data
        return Response({
            **data
        }, status=status.HTTP_200_OK)

    @api_view(['PUT'])
    @permission_classes((permissions.IsAuthenticated, ))
    def change_avatar(request, username):
        files = request.FILES
        uploaded = files['file']
        user = User.objects.get(username=username)
        f = uploaded.open("rb")
        encoded_img_decode_utf8 = base64.b64encode(f.read()).decode('utf-8')
        user.avatar = encoded_img_decode_utf8
        user.save()
        return Response({
            "success": True,
            "data": "OK",
            "message": "Avatar Changed Successfully"
        }, status=status.HTTP_200_OK)