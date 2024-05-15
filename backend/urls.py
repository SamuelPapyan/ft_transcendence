from django.urls import path
from . import views

urlpatterns = [
    path('users', view=views.UserApiViews.UserApiViews.ApiOverview, name='users'),
    path('users/create', views.UserApiViews.UserApiViews.add_users, name='add-users'),
    path('users/all', view=views.UserApiViews.UserApiViews.view_users, name='view-users'),
    path('users/<str:username>', view=views.UserApiViews.UserApiViews.get_user, name='get-user'),
    path('users/<str:username>/update', views.UserApiViews.UserApiViews.update_users, name='update-users'),
    path('users/<str:username>/delete', view=views.UserApiViews.UserApiViews.delete_items, name='delete-items'),
    path('matches', view=views.MatchApiViews.MatchApiViews.ApiOverview, name='matches'),
    path('matches/ongoing', view=views.MatchApiViews.MatchApiViews.ongoing_matches, name='ongoing-matches'),
    # path('matches/all', view=views.MatchApiViews.MatchApiViews.view_matches, name='view-matches'),
    path('token', view=views.ObtainTokenApiView.ObtainTokenView.as_view(), name='optain-token')
]