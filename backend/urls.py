from django.urls import path
from . import views

urlpatterns = [
    path('users', view=views.UserApiViews.ApiOverview, name='users'),
    path('users/create', views.UserApiViews.add_users, name='add-users'),
    path('users/all', view=views.UserApiViews.view_users, name='view-users'),
    path('users/username', view=views.UserApiViews.change_username, name='change-username'),
    path('users/password', view=views.UserApiViews.change_password, name='change-password'),
    path('users/<str:username>', view=views.UserApiViews.get_user, name='get-user'),
    path('users/avatar/<str:username>', view=views.UserApiViews.change_avatar, name='change-avatar'),
    path('users/<str:username>/update', views.UserApiViews.update_users, name='update-users'),
    path('users/<str:username>/delete', view=views.UserApiViews.delete_items, name='delete-items'),
    path('matches', view=views.MatchApiViews.ApiOverview, name='matches'),
    path('matches/ongoing', view=views.MatchApiViews.ongoing_matches, name='ongoing-matches'),
    path('matches/ongoing/<str:username>', view=views.MatchApiViews.has_ongoing_match, name='user-ongoing-match'),
    path('matches/<str:username>', view=views.MatchApiViews.get_user_match_history, name='user-match-history'),
    path('chat', view=views.ChatApiViews.ApiOverview, name='chat'),
    path('chat/dm', view=views.ChatApiViews.create_dm, name='create-dm'),
    path('chat/dm/has', view=views.ChatApiViews.has_dm_channel, name='has-dm'),
    path('friends', view=views.FriendsApiView.ApiOverview, name='friends'),
    path('friends/send', view=views.FriendsApiView.send_friend_request, name='send-fr'),
    path('friends/remove', view=views.FriendsApiView.remove_friend, name='remove-friend'),
    path('friends/reject', view=views.FriendsApiView.reject_friend_request, name='reject-fr'),
    path('friends/accept', view=views.FriendsApiView.accept_friend_request, name='accept-fr'),
    path('friends/sent/<str:username>', view=views.FriendsApiView.get_sent_requests, name='get-sent-fr'),
    path('friends/fr/<str:username>', view=views.FriendsApiView.get_friend_requests, name='get-fr'),
    path('friends/<str:username>', view=views.FriendsApiView.get_friends, name='get-friends'),
    path('2fa', view=views.UserApiViews.set_2fa, name='set-2fa'),
    path('2fa/verify', view=views.UserApiViews.verify_2fa, name='verify-2fa'),
    path('login42', view=views.User42ApiViews.login_42, name='login-42'),
    path('token', view=views.ObtainTokenView.as_view(), name='optain-token')
]