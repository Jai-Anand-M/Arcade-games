import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'my_arcade.settings')
django.setup()

from arcade.models import Game

def add_games():
    Game.objects.get_or_create(
        title="Ping Pong",
        slug="pong",
        defaults={
            'description': "Classic 2-player neon ping pong! W/S controls the left paddle, Up/Down keys control the right paddle. First to 20 wins."
        }
    )
    
    Game.objects.get_or_create(
        title="Tetris",
        slug="tetris",
        defaults={
            'description': "Stack the falling neon tetrominoes. Use Arrow keys or WASD to move and rotate."
        }
    )

    Game.objects.get_or_create(
        title="Snake",
        slug="snake",
        defaults={
            'description': "Classic Snake! Eat the glowing food to grow, but don't crash into the walls or yourself."
        }
    )
    
    Game.objects.get_or_create(
        title="Asteroids",
        slug="asteroids",
        defaults={
            'description': "Destroy the neon asteroids coming towards your ship. Controls: Left/Right to rotate, Up to thrust, Space to shoot."
        }
    )
    
    print("All four retro games (Ping Pong, Tetris, Snake, Asteroids) have been added to the database!")

if __name__ == '__main__':
    add_games()
