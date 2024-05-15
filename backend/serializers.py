from .models import User, Match
from rest_framework import serializers

class UserSerializer(serializers.HyperlinkedModelSerializer):
    username = serializers.CharField()
    password = serializers.CharField()
    class Meta:
        model = User
        fields = ['username', 'password']

class UserViewSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'two_factor', 'full_name']

# class MatchSerializer(serializers.ModelSerializer):
#     p1_username = serializers.RelatedField(

#     )
#     p2_username = serializers.RelatedField(
#         many=False,
#         read_only=True,
#         source='p2'
#     )
#     class Meta:
#         model = Match
#         fields = ['p1_username', 'p2_username']

class ObtainTokenSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()