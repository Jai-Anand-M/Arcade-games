import os
from django.core.wsgi import get_wsgi_application

# Ensure this points to YOUR project name
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'my_arcade.settings')

application = get_wsgi_application()