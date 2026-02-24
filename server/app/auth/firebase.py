import json
import os
import logging
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth
from typing import Optional, Dict, Any
from app.auth.redis import (
    cache_token_verification,
    get_cached_token_verification,
    invalidate_token_cache,
)

logger = logging.getLogger(__name__)
_firebase_app = None


def initialize_firebase():
    global _firebase_app
    if _firebase_app:
        return _firebase_app
    config_json = os.environ.get('FIREBASE_CONFIG_JSON')
    if not config_json:
        raise ValueError("FIREBASE_CONFIG_JSON not set")
    try:
        cred = credentials.Certificate(json.loads(config_json))
        _firebase_app = firebase_admin.initialize_app(cred)
        logger.info("Firebase Admin SDK initialized")
        return _firebase_app
    except ValueError:
        _firebase_app = firebase_admin.get_app()
        return _firebase_app


def verify_id_token(token: str) -> Optional[Dict[str, Any]]:
    if not token or len(token) < 100:
        return None

    # ── Redis cache check ──
    cached = get_cached_token_verification(token)
    if cached:
        return cached

    try:
        initialize_firebase()
    except Exception as e:
        logger.error("Firebase not initialized: %s", e)
        return None

    # ── FIX: verify WITHOUT check_revoked first (fast, no network call) ──
    # Then attempt revocation check separately so a transient network
    # error during the revocation lookup doesn't reject a valid token.
    try:
        decoded = firebase_auth.verify_id_token(token, check_revoked=False)
    except firebase_auth.ExpiredIdTokenError:
        invalidate_token_cache(token)
        logger.debug("Token expired")
        return None
    except firebase_auth.InvalidIdTokenError as e:
        logger.debug("Invalid token: %s", e)
        return None
    except firebase_auth.CertificateFetchError as e:
        logger.warning("Certificate fetch error (will retry): %s", e)
        return None
    except Exception as e:
        logger.error("Firebase token verification error: %s", e)
        return None

    # ── Soft revocation check (best-effort, non-blocking) ──
    try:
        firebase_auth.verify_id_token(token, check_revoked=True)
    except firebase_auth.RevokedIdTokenError:
        invalidate_token_cache(token)
        logger.info("Token was revoked for uid=%s", decoded.get('uid'))
        return None
    except Exception as e:
        # Network issue during revocation check — token signature is
        # already verified above, so we accept it and log a warning.
        logger.warning("Revocation check failed (accepting token): %s", e)

    cache_token_verification(token, decoded)
    return decoded


def extract_user_info(decoded_token: Dict[str, Any]) -> Dict[str, Any]:
    return {
        'uid': decoded_token.get('uid'),
        'email': decoded_token.get('email'),
        'name': decoded_token.get('name'),
        'picture': decoded_token.get('picture'),
        'email_verified': decoded_token.get('email_verified', False),
        'auth_provider': decoded_token.get('firebase', {}).get('sign_in_provider', 'password'),
    }