from django.urls import path
from . import views

urlpatterns = [
    path('', views.lobby, name='lobby'),
    path('play/<slug:slug>/', views.play_game, name='play_game'),
]