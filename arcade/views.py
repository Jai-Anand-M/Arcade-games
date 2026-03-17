from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Game, HighScore

@login_required
def lobby(request):
    games = Game.objects.all()
    return render(request, 'arcade/index.html', {'games': games})

@login_required
def play_game(request, slug):
    game = get_object_or_404(Game, slug=slug)
    leaderboard = HighScore.objects.filter(game=game)[:5]
    return render(request, 'arcade/game.html', {
        'game': game, 
        'leaderboard': leaderboard
    })