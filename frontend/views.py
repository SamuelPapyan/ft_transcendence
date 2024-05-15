from django.shortcuts import render

def view_index(request):
    return render(request, '_index.html')
