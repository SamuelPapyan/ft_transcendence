from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import permissions, serializers, status
from backend.models import Match

class MatchApiViews:
    @api_view(['GET'])
    @permission_classes((permissions.AllowAny,))
    def ApiOverview(request):
        api_urls = {
            'all_items': '/matches/ongoing',
            'Add': '/matches/create',
            'Update': 'matches/<id>/update',
            'Delete': '/matches/<id>/delete'
        }
    
        return Response(api_urls)
    
    # @api_view(['GET'])
    # @permission_classes((permissions.IsAuthenticated, ))
    # def ongoing_matches(request):
    #     ongoings = Match.objects.filter(is_ongoing=True)

    #     return Response(MatchSerializer(ongoings, many=True).data)