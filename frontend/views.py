from django.template import loader
from django.http import HttpResponse, HttpResponseRedirect
from .forms.LoginForm import LoginForm
from django.shortcuts import render

def home(request):
    template = loader.get_template('home.html')
    context = {
        "players": [{"name": "Samvel", "wins": 20, "loss": 11}, {"name": "Baka", "wins": 20, "loss": 21}, {"name": "Gundo", "wins": 19, "loss": 12},]
    }
    return HttpResponse(template.render(context, request))

def login(request):
    if request.method == "POST":
        form = LoginForm(request.POST)
        if form.is_valid():
            return HttpResponseRedirect('/')
        else:
            print("Invalid")
            return render(request, 'login.html', {"non_valid": True})
    return render(request, 'login.html')

def signup(request):
    if request.method == "POST":
        form = LoginForm(request.POST)
        if form.is_valid():
            return HttpResponseRedirect('/')
        else:
            print("Invalid")
            return render(request, 'register.html', {"non_valid": True})
    return render(request, 'register.html')
