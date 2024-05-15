"""
ASGI config for ft_transcendence project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter
from channels.routing import URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path
from backend.consumers import MatchMaking, PongConsumer


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ft_transcendence.settings')

asgi = get_asgi_application()

application = ProtocolTypeRouter({
    "http": asgi,
    "websocket": AuthMiddlewareStack(
        URLRouter([
            path('ws', MatchMaking.as_asgi()),
            path('ws/pong', PongConsumer.as_asgi()),
        ])
    )
})
