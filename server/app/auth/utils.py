# server/app/auth/utils.py

from flask import g


def get_current_user_id() -> str:
    u = g.current_user
    if isinstance(u, dict):
        return u.get('id') or u.get('uid')
    return getattr(u, 'id', getattr(u, 'uid', None))