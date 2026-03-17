from django.contrib import admin
from .models import Game, HighScore

# This tells Django to show these tables in the dashboard
admin.site.register(Game)
admin.site.register(HighScore)