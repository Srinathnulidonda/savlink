# server/app/utils/time.py

from datetime import datetime
from typing import Optional


def relative_time(dt: Optional[datetime]) -> str:
    if not dt:
        return ''

    try:
        now = datetime.utcnow()
        diff = now - dt
        seconds = int(diff.total_seconds())

        if seconds < 60:
            return 'Just now'

        minutes = seconds // 60
        if minutes < 60:
            return f'{minutes}m ago'

        hours = minutes // 60
        if hours < 24:
            return f'{hours}h ago'

        days = hours // 24
        if days < 7:
            return f'{days}d ago'

        weeks = days // 7
        if weeks < 4:
            return f'{weeks}w ago'

        return dt.strftime('%b %d')
    except Exception:
        return ''


def format_datetime(dt: Optional[datetime], fmt: str = '%Y-%m-%d %H:%M') -> str:
    if not dt:
        return ''
    try:
        return dt.strftime(fmt)
    except Exception:
        return ''