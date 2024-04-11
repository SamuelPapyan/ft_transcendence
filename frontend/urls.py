from django.urls import path, re_path
from . import views

urlpatterns = [
    re_path('', views.view_index, name="_index")
    # path('', views.home, name='home'),
    # path('login', views.login, name='login'),
    # path('signup/', views.signup, name='signup'),
]