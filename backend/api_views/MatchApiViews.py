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
        }, status=status.HTTP_200_OK)

    @api_view(['GET'])
    @permission_classes((permissions.AllowAny,))
    def has_ongoing_match(request, username):
        u = User.objects.get(username=username)
        exists_1 = Match.objects.filter(Q(p1=u) | Q(p2=u), is_ongoing=True).exists()
        exists_2 = Match.objects.filter(winner=u, is_tournament=True).exists()
        return Response({
                'success': True,
                'data': exists_1 or exists_2,
                'message': 'Is the user\'s match ongoing?'
            },status=status.HTTP_200_OK)
    
    @api_view(['GET'])
    @permission_classes((permissions.IsAuthenticated,))
    def get_user_match_history(request, username):
        match_history = []
        user = User.objects.get(username=username)
        matches = Match.objects.filter(Q(p1=user) | Q(p2=user))
        for m in matches:
            match_history.append({
                "p1": m.p1.username,
                "p2": m.p2.username,
                "p1_score":m.p1_score,
                "p2_score":m.p2_score,
                "winner": m.winner.username,
                "start": m.start.strftime("%d/%m/%Y | %H:%M:%S"),
                "end": m.end.strftime("%d/%m/%Y | %H:%M:%S"),
            })
        return Response(match_history, status=status.HTTP_200_OK)