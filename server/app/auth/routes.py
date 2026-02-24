# server/app/auth/routes.py

import time
from flask import g, request
from app.auth import auth_bp
from app.auth.middleware import require_auth
from app.auth.emergency.service import request_emergency_access, verify_emergency_token
from app.auth.redis import (
    check_login_rate_limit,
    check_auth_rate_limit,
    get_cached_user_data,
    cache_user_data,
    is_redis_available
)
from app.responses import success_response, error_response
import logging

logger = logging.getLogger(__name__)


@auth_bp.route('/me', methods=['GET'])
@require_auth
def get_current_user():
    """
    Get current authenticated user.
    
    Performance: This is the most called endpoint.
    With Redis caching in middleware, typical response: <10ms
    """
    try:
        user = g.current_user
        
        if user is None:
            return error_response('User not found', 500, 'USER_NOT_FOUND')
        
        # g.current_user is already a dict from middleware (cached)
        if isinstance(user, dict):
            user_data = user
        else:
            user_data = user.to_dict()
        
        return success_response(user_data)
    except Exception as e:
        logger.error(f"Error in /auth/me: {e}", exc_info=True)
        return error_response('Failed to get user data', 500)


@auth_bp.route('/session', methods=['GET'])
@require_auth
def get_session_info():
    """Get current session details including auth source and cache status."""
    try:
        user = g.current_user
        
        if user is None:
            return error_response('No active session', 500)
        
        user_data = user if isinstance(user, dict) else user.to_dict()
        
        session_data = {
            'user': user_data,
            'auth_source': getattr(g, 'auth_source', 'unknown'),
            'is_emergency': getattr(g, 'auth_source', None) == 'emergency',
            'cached': getattr(g, 'auth_source', '').endswith('_cached'),
            'timestamp': time.time()
        }
        
        return success_response(session_data)
    except Exception as e:
        logger.error(f"Error in /auth/session: {e}", exc_info=True)
        return error_response('Internal server error', 500)


@auth_bp.route('/emergency/request', methods=['POST'])
def request_emergency():
    """Request emergency access token with rate limiting."""
    try:
        # Rate limit by IP
        client_ip = _get_client_ip()
        ip_allowed, _ = check_auth_rate_limit(client_ip)
        if not ip_allowed:
            return error_response('Too many requests', 429, 'RATE_LIMITED')
        
        data = request.get_json(silent=True)
        
        if not data:
            return error_response('Invalid request body', 400)
        
        email = data.get('email', '').strip().lower()
        
        if not email or '@' not in email or len(email) > 255:
            return error_response('Valid email is required', 400, 'INVALID_EMAIL')
        
        success = request_emergency_access(email, client_ip)
        
        # Always return success to prevent user enumeration
        return success_response(
            message='If an account exists with this email, an emergency access token has been sent.'
        )
        
    except Exception as e:
        logger.error(f"Emergency request error: {e}", exc_info=True)
        return error_response('Internal server error', 500)


@auth_bp.route('/emergency/verify', methods=['POST'])
def verify_emergency():
    """Verify emergency access token."""
    try:
        # Rate limit by IP
        client_ip = _get_client_ip()
        ip_allowed, _ = check_auth_rate_limit(client_ip)
        if not ip_allowed:
            return error_response('Too many requests', 429, 'RATE_LIMITED')
        
        data = request.get_json(silent=True)
        
        if not data:
            return error_response('Invalid request body', 400)
        
        email = data.get('email', '').strip().lower()
        token = data.get('token', '').strip()
        
        if not email or '@' not in email:
            return error_response('Valid email is required', 400, 'INVALID_EMAIL')
        
        if not token or len(token) < 10:
            return error_response('Valid token is required', 400, 'INVALID_TOKEN')
        
        session_token = verify_emergency_token(email, token, client_ip)
        
        if session_token:
            logger.info(f"Emergency access granted for: {email}")
            return success_response({
                'token': session_token,
                'type': 'emergency',
                'expires_in': 3600
            })
        else:
            # Generic error to prevent token enumeration
            return error_response('Invalid or expired token', 401, 'INVALID_TOKEN')
        
    except Exception as e:
        logger.error(f"Emergency verify error: {e}", exc_info=True)
        return error_response('Internal server error', 500)


@auth_bp.route('/health', methods=['GET'])
def auth_health():
    """Health check for auth subsystem."""
    try:
        from app.auth.firebase import _firebase_app, get_verification_metrics
        
        health = {
            'service': 'auth',
            'status': 'healthy',
            'timestamp': time.time(),
            'firebase': 'configured' if _firebase_app else 'not_configured',
            'redis': is_redis_available(),
        }
        
        # Include verification metrics in non-production or when requested
        if request.args.get('metrics') == 'true':
            health['verification_metrics'] = get_verification_metrics()
        
        return success_response(health)
    except Exception as e:
        logger.error(f"Auth health check error: {e}", exc_info=True)
        return error_response('Auth service error', 503)


def _get_client_ip() -> str:
    """Extract real client IP."""
    forwarded = request.headers.get('X-Forwarded-For')
    if forwarded:
        return forwarded.split(',')[0].strip()
    
    real_ip = request.headers.get('X-Real-IP')
    if real_ip:
        return real_ip.strip()
    
    return request.remote_addr or '0.0.0.0'