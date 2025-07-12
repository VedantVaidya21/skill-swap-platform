from django.shortcuts import render
from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache
from django.conf import settings
import os

# Serve the React SPA - index.html for all routes
@never_cache
def serve_react_app(request, *args, **kwargs):
    index_path = os.path.join(settings.BASE_DIR, 'frontend', 'build', 'index.html')
    if os.path.exists(index_path):
        with open(index_path, 'r') as f:
            content = f.read()
            return render(request, 'index.html')
    return render(request, 'index.html')
