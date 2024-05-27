from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import permissions, serializers, status
from backend.models import User, Match
from backend.serializers import UserSerializer, UserViewSerializer
from django.contrib.auth import get_user_model
from backend.authentication import JWTAuthentication
from django.db.models import Q
import requests
import os
from dotenv import load_dotenv
import base64

def get_access_token(code):
    load_dotenv()
    data = {
        'grant_type': 'authorization_code',
        'client_id': os.getenv('INTRA_API_UID'),
        'client_secret': os.getenv('INTRA_API_SECRET'),
        'redirect_uri': os.getenv('INTRA_REDIRECT_URI'),
        'code': code
    }
    headers = { 'Accept': "application/x-www-form-urlencoded", 'Content-Type': "application/x-www-form-urlencoded" }
    response = requests.post('https://api.intra.42.fr/oauth/token', data=data, headers=headers)
    if response.status_code != 200:
        return None
    return response.json()

def get_user_data(access_token):
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "bearer " + access_token
    }
    response = requests.get('https://api.intra.42.fr/v2/me', headers=headers)
    return response.json()

def get_user(user_data):
    u = User.objects.filter(username=user_data["login"]).first()
    if u is None:
        User.objects.create_user(
            username=user_data["login"],
            password="Intra42@Password",
        )
        u = User.objects.get(username=user_data["login"])
        u.email = user_data["email"]
        u.is_42_user = True
        image_url = user_data["image"]
        image_link = image_url['link']
        image_response = requests.get(image_link)
        image_content_base64 = base64.b64encode(image_response.content).decode('utf-8')
        u.avatar = image_content_base64
        u.save()

    return u

class User42ApiViews:
    @api_view(['GET', 'POST'])
    @permission_classes((permissions.AllowAny, ))
    def login_42(request):
        if request.method == 'GET':
            load_dotenv()
            client_id = os.getenv('INTRA_API_UID')
            redirect_uri = os.getenv('INTRA_REDIRECT_URI')
            intra_api_url = os.getenv('INTRA_API_URL')
            url = intra_api_url + "/oauth/authorize?client_id=" + client_id + "&redirect_uri=" + redirect_uri + "&response_type=code"
            return Response(url, status=status.HTTP_200_OK)
            
        if request.method == 'POST':
            data = request.data
            access_token = get_access_token(data["code"])
            if access_token is None:
                return Response({
                    None
                }, status=status.HTTP_401_UNAUTHORIZED)
            user_data = get_user_data(access_token["access_token"])
            user = get_user(user_data)
            return Response(
                JWTAuthentication.create_jwt(user, True)
                , status=status.HTTP_202_ACCEPTED)