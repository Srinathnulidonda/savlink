# test_banner.py
# Run: python test_banner.py

import logging
import sys
import os
from datetime import datetime, timezone

logging.basicConfig(
    level=logging.INFO,
    format='%(levelname)-5s  %(message)s',
    stream=sys.stdout
)
logger = logging.getLogger(__name__)


class MockRedisClient:
    def __init__(self, available=True):
        self.available = available

redis_client = MockRedisClient(available=True)


def _log_startup_banner(config):
    env = config.get('FLASK_ENV', 'development')
    debug = config.get('DEBUG', False)
    port = os.environ.get('PORT', '10000')
    cors_count = len(config.get('CORS_ORIGINS', []))
    db_uri = config.get('SQLALCHEMY_DATABASE_URI', '')
    db_driver = db_uri.split('://')[0].split('+')[0] if '://' in db_uri else 'none'
    firebase_ok = bool(config.get('FIREBASE_CONFIG_JSON'))
    redis_ok = redis_client.available
    now = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')

    services = [
        ("database", db_driver, db_driver != 'none'),
        ("redis", "connected" if redis_ok else "unavailable", redis_ok),
        ("auth", "firebase" if firebase_ok else "disabled", firebase_ok),
    ]

    all_ok = all(h for _, _, h in services)

    logger.info("")
    logger.info("  ███████╗ █████╗ ██╗   ██╗██╗     ██╗███╗   ██╗██╗  ██╗")
    logger.info("  ██╔════╝██╔══██╗██║   ██║██║     ██║████╗  ██║██║ ██╔╝")
    logger.info("  ███████╗███████║██║   ██║██║     ██║██╔██╗ ██║█████╔╝ ")
    logger.info("  ╚════██║██╔══██║╚██╗ ██╔╝██║     ██║██║╚██╗██║██╔═██╗ ")
    logger.info("  ███████║██║  ██║ ╚████╔╝ ███████╗██║██║ ╚████║██║  ██╗")
    logger.info("  ╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝")
    logger.info("")
    logger.info("  api.savlink")
    logger.info("  v0.3.0 · Link Management API")
    logger.info("")
    logger.info("  ── Configuration ──────────────────────────────")
    logger.info("")
    logger.info("    environment   %s", env)
    logger.info("    port          %s", port)
    logger.info("    debug         %s", "on" if debug else "off")
    logger.info("    cors          %d origins", cors_count)
    logger.info("    blueprints    13")
    logger.info("")
    logger.info("  ── Services ───────────────────────────────────")
    logger.info("")
    for name, value, healthy in services:
        icon = "✓" if healthy else "✗"
        logger.info("    %s  %-12s  %s", icon, name, value)
    logger.info("")
    logger.info("  ── Status ─────────────────────────────────────")
    logger.info("")
    logger.info("    %s  %s", "●" if all_ok else "◐", "All systems operational" if all_ok else "Degraded mode")
    logger.info("    Started %s", now)
    logger.info("")


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  TEST SCENARIOS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def test_production():
    print("\n" + "█" * 60)
    print("  TEST 1: Production — All systems operational")
    print("█" * 60)

    redis_client.available = True
    os.environ['PORT'] = '10000'

    _log_startup_banner({
        'FLASK_ENV': 'production',
        'DEBUG': False,
        'CORS_ORIGINS': [
            'https://savlink.com',
            'https://www.savlink.com',
            'https://app.savlink.com',
            'http://localhost:3000',
            'http://localhost:5173',
        ],
        'SQLALCHEMY_DATABASE_URI': 'postgresql+psycopg2://user:pass@host:5432/savlink',
        'FIREBASE_CONFIG_JSON': '{"type": "service_account"}',
    })


def test_development():
    print("\n" + "█" * 60)
    print("  TEST 2: Development — Degraded mode")
    print("█" * 60)

    redis_client.available = False
    os.environ['PORT'] = '5000'

    _log_startup_banner({
        'FLASK_ENV': 'development',
        'DEBUG': True,
        'CORS_ORIGINS': ['http://localhost:3000'],
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///dev.db',
        'FIREBASE_CONFIG_JSON': '',
    })


def test_staging():
    print("\n" + "█" * 60)
    print("  TEST 3: Staging — Partial services")
    print("█" * 60)

    redis_client.available = True
    os.environ['PORT'] = '8080'

    _log_startup_banner({
        'FLASK_ENV': 'staging',
        'DEBUG': False,
        'CORS_ORIGINS': [
            'https://staging.savlink.com',
            'http://localhost:3000',
        ],
        'SQLALCHEMY_DATABASE_URI': 'postgresql://user:pass@host:5432/savlink_staging',
        'FIREBASE_CONFIG_JSON': '',
    })


if __name__ == '__main__':
    test_production()
    test_development()
    test_staging()

    print("\n" + "=" * 60)
    print("  All tests complete")
    print("=" * 60 + "\n")