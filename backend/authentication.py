from datetime import datetime, timedelta

import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed, ParseError

User = get_user_model()

class JWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        jwt_token = request.META.get('HTTP_AUTHORIZATION')
        if jwt_token is None:
            return None
        
        jwt_token = JWTAuthentication.get_the_token_from_header(jwt_token)

        try:
            payload = jwt.decode(jwt_token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.exceptions.InvalidSignatureError:
            raise AuthenticationFailed('Invalid signature')
        except:
            raise ParseError()
        
        username = payload.get('user_identifier')
        if username is None:
            raise AuthenticationFailed('User identifier not found in JWT')
        
        user = User.objects.filter(username=username).first()
        if user is None:
            raise AuthenticationFailed('User not found')
        payload["avatar"] = user.avatar
        
        return user, payload

    def authenticate_header(self, request):
        return 'Bearer'
    
    @classmethod
    def create_jwt(cls, user, log_in):
        payload = {
            'user_identifier': user.username,
            'exp': int((datetime.now() + timedelta(hours=1)).timestamp()),
            'iat': datetime.now().timestamp(),
            'username': user.username,
            'email': user.email,
        }
        if log_in and user.two_factor:
            payload["two_factoring"] = True
        jwt_token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
        return jwt_token
    
    @classmethod
    def get_the_token_from_header(cls, token):
        token = token.replace('Bearer', '').replace(' ', '')
        return token