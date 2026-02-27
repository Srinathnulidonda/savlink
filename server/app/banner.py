# server/app/banner.py

import os
import logging
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

# ASCII Art Logo
LOGO = [
    "███████╗ █████╗ ██╗   ██╗██╗     ██╗███╗   ██╗██╗  ██╗",
    "██╔════╝██╔══██╗██║   ██║██║     ██║████╗  ██║██║ ██╔╝",
    "███████╗███████║██║   ██║██║     ██║██╔██╗ ██║█████╔╝ ",
    "╚════██║██╔══██║╚██╗ ██╔╝██║     ██║██║╚██╗██║██╔═██╗ ",
    "███████║██║  ██║ ╚████╔╝ ███████╗██║██║ ╚████║██║  ██╗",
    "╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝",
]

VERSION = "0.3.0"
SERVICE_NAME = "api.savlink"
DESCRIPTION = "Link Management API"


def get_db_driver(db_uri: str) -> str:
    """Extract database driver from URI"""
    if not db_uri or '://' not in db_uri:
        return 'none'
    return db_uri.split('://')[0].split('+')[0]


def get_service_status(services: list) -> tuple:
    """
    Determine overall service status
    Returns: (icon, message)
    """
    healthy_count = sum(1 for _, _, healthy in services if healthy)
    total_count = len(services)

    if healthy_count == total_count:
        return "●", "All systems operational"
    elif healthy_count == 0:
        return "○", "All services down"
    else:
        return "◐", "Degraded mode"


def log_startup_banner(app, redis_client=None):
    """
    Display professional startup banner with service health status
    
    Args:
        app: Flask application instance
        redis_client: Optional redis client to check connectivity
    """
    # Extract configuration
    env = app.config.get('FLASK_ENV', 'development')
    debug = app.config.get('DEBUG', False)
    port = os.environ.get('PORT', '10000')
    cors_count = len(app.config.get('CORS_ORIGINS', []))
    
    # Database info
    db_uri = app.config.get('SQLALCHEMY_DATABASE_URI', '')
    db_driver = get_db_driver(db_uri)
    
    # Service checks
    firebase_ok = bool(app.config.get('FIREBASE_CONFIG_JSON'))
    redis_ok = redis_client.available if redis_client else False
    
    # Timestamp
    now = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')
    
    # Build services list
    services = [
        ("database", db_driver, db_driver != 'none'),
        ("redis", "connected" if redis_ok else "unavailable", redis_ok),
        ("auth", "firebase" if firebase_ok else "disabled", firebase_ok),
    ]
    
    status_icon, status_message = get_service_status(services)
    
    # ── Print Banner ──
    logger.info("")
    
    # Logo
    for line in LOGO:
        logger.info("  %s", line)
    
    logger.info("")
    logger.info("  %s", SERVICE_NAME)
    logger.info("  v%s · %s", VERSION, DESCRIPTION)
    logger.info("")
    
    # Configuration section
    logger.info("  ── Configuration ──────────────────────────────")
    logger.info("")
    logger.info("    %-14s%s", "environment", env)
    logger.info("    %-14s%s", "port", port)
    logger.info("    %-14s%s", "debug", "on" if debug else "off")
    logger.info("    %-14s%d origins", "cors", cors_count)
    logger.info("    %-14s%d", "blueprints", 13)
    logger.info("")
    
    # Services section
    logger.info("  ── Services ───────────────────────────────────")
    logger.info("")
    for name, value, healthy in services:
        icon = "✓" if healthy else "✗"
        logger.info("    %s  %-12s%s", icon, name, value)
    logger.info("")
    
    # Status section
    logger.info("  ── Status ─────────────────────────────────────")
    logger.info("")
    logger.info("    %s  %s", status_icon, status_message)
    logger.info("    Started %s", now)
    logger.info("")