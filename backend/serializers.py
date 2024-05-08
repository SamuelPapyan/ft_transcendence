from .models import User
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
#     p1_name = serializers.RelatedField(
#         many=False,
#         read_only=True,
#         source='p1',
#     )
#     p2_name = serializers.RelatedField(
#         many=False,
#         read_only=True,
#         source='p2',
#     )
#     win_name = serializers.RelatedField(
#         many=False,
#         read_only=True,
#         source='win',
#     )
#     lose_name = serializers.RelatedField(
#         many=False,
#         read_only=True,
#         source='lose',
#     )
#     class Meta:
#         model = Match
#         fields = ['p1_name', 'p2_name', 'p1_score', 'p2_score', 'win_name', 'lose_name']

class ObtainTokenSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()