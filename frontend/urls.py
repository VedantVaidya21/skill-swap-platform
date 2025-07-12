from django.urls import path, re_path
from .views import serve_react_app

urlpatterns = [
    # Catch all routes and let React handle routing
    re_path(r'^.*$', serve_react_app, name='react-app'),
] 