from django.contrib.auth import get_user_model
from rest_framework import views, permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed, ParseError

from backend.serializers import ObtainTokenSerializer
from backend.authentication import JWTAuthentication
import jwt
from django.conf import settings

User = get_user_model()

class ObtainTokenView(views.APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ObtainTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data.get('username')
        password = serializer.validated_data.get('password')

        user = User.objects.filter(username=username).first()
        if user is None or not user.check_password(password):
            return Response({
                'success': False,
                'data': None,
                'message': 'Invalid credentials'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        jwt_token = JWTAuthentication.create_jwt(user, True)

        return Response({
            'success': True,
            'data': jwt_token,
            'message': 'Log in Successful'
        }, status=status.HTTP_200_OK)
    
    def get(self, request, *args, **kwargs):
        token = request.META.get('HTTP_AUTHORIZATION')
        if token:
            token = token.split(' ')[1]
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                user = User.objects.get(username=payload["username"])
                payload["avatar"] = user.avatar
            except jwt.exceptions.InvalidSignatureError:
                raise AuthenticationFailed('Invalid signature')
            except:
                raise ParseError()
            return Response({'data': payload})
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)