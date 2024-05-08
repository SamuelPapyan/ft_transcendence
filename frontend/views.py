from django.template import loader
from django.http import HttpResponse, HttpResponseRedirect
from .forms.LoginForm import LoginForm
from django.shortcuts import render

def view_index(request):
    return render(request, '_index.html')
