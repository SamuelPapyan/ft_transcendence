from django.urls import path
from . import views

urlpatterns = [
    path('users', view=views.UserApiViews.ApiOverview, name='users'),
    path('users/create', views.UserApiViews.add_users, name='add-users'),
    path('users/all', view=views.UserApiViews.view_users, name='view-users'),
    path('users/<str:username>', view=views.UserApiViews.get_user, name='get-user'),
    path('users/<str:username>/update', views.UserApiViews.update_users, name='update-users'),
    path('users/<str:username>/delete', view=views.UserApiViews.delete_items, name='delete-items'),
    path('matches', view=views.MatchApiViews.ApiOverview, name='matches'),
    path('matches/ongoing', view=views.MatchApiViews.ongoing_matches, name='ongoing-matches'),
    path('matches/ongoing/<str:username>', view=views.MatchApiViews.has_ongoing_match, name='user-ongoing-match'),
    path('chat', view=views.ChatApiViews.ApiOverview, name='chat'),
    path('chat/dm', view=views.ChatApiViews.create_dm, name='create-dm'),
    path('chat/dm/has', view=views.ChatApiViews.has_dm_channel, name='has-dm'),
    # path('matches/all', view=views.MatchApiViews.view_matches, name='view-matches'),
    path('token', view=views.ObtainTokenView.as_view(), name='optain-token')
]