# server/app/auth/middleware.py

import time
from functools import wraps
from flask import request, g
from app.responses import error_response
from app.auth.firebase import verify_id_token, extract_user_info
from app.auth.provisioning import provision_user_cached
from app.auth.sessions import verify_emergency_session
from app.auth.redis import (
    get_cached_user_data,
    cache_user_data,
    check_auth_rate_limit
)
import logging

logger = logging.getLogger(__name__)


def require_auth(f):
    """
    Authentication middleware with multi-layer caching.
    
    Auth flow:
    1. Extract Bearer token from header
    2. Rate limit check (Redis)
    3. Verify token (Redis cache → Firebase Admin SDK)
    4. Get user data (Redis cache → Database)
    5. Set g.current_user for the request
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        start_time = time.time()
        
        # ── Step 1: Extract token ──
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return error_response('Authorization header required', 401, 'AUTH_MISSING')
        
        if not auth_header.startswith('Bearer '):
            return error_response('Invalid authorization format. Use: Bearer <token>', 401, 'AUTH_FORMAT')
        
        token = auth_header[7:].strip()
        
        if not token or len(token) < 100:
            return error_response('Invalid token', 401, 'AUTH_INVALID')
        
        # ── Step 2: Rate limiting ──
        client_ip = _get_client_ip()
        is_allowed, remaining = check_auth_rate_limit(client_ip)
        
        if not is_allowed:
            logger.warning(f"Auth rate limit exceeded for IP: {client_ip}")
            return error_response('Too many requests', 429, 'RATE_LIMITED')
        
        try:
            # ── Step 3: Try Firebase token ──
            user, auth_source = _authenticate_firebase(token)
            
            if user:
                g.current_user = user
                g.auth_source = auth_source
                
                # Log performance
                duration_ms = (time.time() - start_time) * 1000
                if duration_ms > 500:
                    logger.warning(f"Slow auth: {duration_ms:.0f}ms for {user.get('id', 'unknown')}")
                
                return f(*args, **kwargs)
            
            # ── Step 4: Try emergency session ──
            emergency_user = verify_emergency_session(token)
            
            if emergency_user:
                g.current_user = emergency_user
                g.auth_source = 'emergency'
                return f(*args, **kwargs)
            
            return error_response('Invalid or expired token', 401, 'AUTH_EXPIRED')
            
        except Exception as e:
            logger.error(f"Auth middleware error: {e}", exc_info=True)
            return error_response('Authentication failed', 500, 'AUTH_ERROR')
    
    return decorated_function


def _authenticate_firebase(token: str):
    """
    Verify Firebase token and get user data.
    Uses Redis caching at both token and user levels.
    
    Returns: (user_dict, auth_source) or (None, None)
    """
    # ── Verify token (Redis cached) ──
    decoded_token = verify_id_token(token)
    
    if not decoded_token:
        return None, None
    
    user_info = extract_user_info(decoded_token)
    uid = user_info.get('uid')
    
    if not uid:
        logger.error("Token verified but no UID found")
        return None, None
    
    # ── Get user data (try Redis first, then DB) ──
    user_data = get_cached_user_data(uid)
    
    if user_data:
        # Cache hit - return immediately (no DB query)
        return user_data, 'firebase_cached'
    
    # Cache miss - provision user (DB read/write) and cache
    try:
        user = provision_user_cached(user_info)
        
        if user:
            user_dict = user.to_dict()
            # Cache for subsequent requests
            cache_user_data(uid, user_dict)
            return user_dict, 'firebase'
        
        return None, None
    except Exception as e:
        logger.error(f"User provisioning failed for {uid}: {e}", exc_info=True)
        return None, None


def _get_client_ip() -> str:
    """Extract real client IP from request headers."""
    # Check X-Forwarded-For (load balancer/proxy)
    forwarded = request.headers.get('X-Forwarded-For')
    if forwarded:
        # Take the first IP (client IP)
        return forwarded.split(',')[0].strip()
    
    # Check X-Real-IP (nginx)
    real_ip = request.headers.get('X-Real-IP')
    if real_ip:
        return real_ip.strip()
    
    return request.remote_addr or '0.0.0.0'


def require_verified_email(f):
    """Require email verification in addition to authentication."""
    @wraps(f)
    @require_auth
    def decorated_function(*args, **kwargs):
        user = g.current_user
        
        if isinstance(user, dict):
            email_verified = user.get('email_verified', False)
        else:
            email_verified = getattr(user, 'email_verified', False)
        
        if not email_verified and g.auth_source != 'emergency':
            return error_response('Email verification required', 403, 'EMAIL_NOT_VERIFIED')
        
        return f(*args, **kwargs)
    
    return decorated_function


def optional_auth(f):
    """Optional authentication - sets g.current_user if token provided, None otherwise."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        g.current_user = None
        g.auth_source = None
        
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header[7:].strip()
            
            if token and len(token) >= 100:
                try:
                    user, source = _authenticate_firebase(token)
                    if user:
                        g.current_user = user
                        g.auth_source = source
                except Exception:
                    pass  # Optional auth - don't fail the request
        
        return f(*args, **kwargs)
    
    return decorated_function