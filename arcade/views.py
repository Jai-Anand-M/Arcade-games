from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth import login
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from .models import Game, HighScore

def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('lobby')
    else:
        form = UserCreationForm()
    return render(request, 'registration/signup.html', {'form': form})

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