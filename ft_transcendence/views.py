from django.template import loader
from django.http import HttpResponse
from django.contrib.auth.models import Group, User
from rest_framework import permissions, viewsets


def home(request):
    template = loader.get_template('home.html')
    return HttpResponse(template.render())