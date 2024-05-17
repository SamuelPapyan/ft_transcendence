from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import permissions, serializers, status
from backend.models import Match, User
from django.db.models import Q

class MatchApiViews:
    @api_view(['GET'])
    @permission_classes((permissions.AllowAny,))
    def ApiOverview(request):
        api_urls = {
            'Ongoing Matches': '/matches/ongoing',
            'User Has Ongoing Match': '/matches/ongoing/<username>',
            'Add': '/matches/create',
            'Update': 'matches/<id>/update',
            'Delete': '/matches/<id>/delete'
        }
    
        return Response(api_urls)
    
    @api_view(['GET'])
    @permission_classes((permissions.IsAuthenticated, ))
    def ongoing_matches(request):
        ongoings = Match.objects.filter(is_ongoing=True)
        res = []
        for item in list(ongoings):
            res.append({
                "match": item.id,
                'player_1': item.p1.username,
                'player_2': item.p2.username,
            })

        return Response({
            "success": True,
            "data": res,
            "messages": "Ongoing Matches!"
        })

    @api_view(['GET'])
    @permission_classes((permissions.AllowAny,))
    def has_ongoing_match(request, username):
        u = User.objects.get(username=username)
        exists = Match.objects.filter(Q(p1=u) | Q(p2=u), is_ongoing=True).exists()
        return Response({
                'success': True,
                'data': exists,
                'message': 'Is the user\'s match ongoing?'
            },status=status.HTTP_200_OK)