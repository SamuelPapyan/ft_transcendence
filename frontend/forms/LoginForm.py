from django import forms

class LoginForm(forms.Form):
    username = forms.CharField(label="Username", min_length=5, max_length=100)
    password = forms.CharField(label="Password", min_length=5, max_length=100)