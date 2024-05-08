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
            return Response(data.data)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
    @api_view(['GET'])
    @permission_classes((permissions.AllowAny,))
    def get_user(request, username):
        if User.objects.filter(username=username).exists():
            user = User.objects.get(username=username)
            data = UserSerializer(instance=user)
            return Response(data.data)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

        
    @api_view(['DELETE'])
    @permission_classes((permissions.AllowAny, ))
    def delete_items(request, username):
        if User.objects.filter(username=username).exists():
            item = User.objects.get(username=username)
            item.delete()
            return Response(status=status.HTTP_202_ACCEPTED)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)