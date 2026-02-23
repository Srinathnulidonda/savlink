# server/app/extensions.py
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import redis
import os
import logging
import time

logger = logging.getLogger(__name__)

db = SQLAlchemy()
migrate = Migrate()


class RedisClient:
    """
    Production-grade Redis client with:
    - Connection pooling
    - Auto-reconnection
    - Graceful degradation
    - Health monitoring
    """
    
    def __init__(self):
        self._client = None
        self._available = False
        self._last_error = None
        self._last_reconnect_attempt = 0
        self._reconnect_interval = 30  # seconds between reconnect attempts
        self._initialize()
    
    def _initialize(self):
        """Initialize Redis connection with optimized settings."""
        redis_url = os.environ.get('REDIS_URL')
        if not redis_url:
            logger.info("REDIS_URL not configured - Redis features disabled")
            return
        
        try:
            # Connection pool for better performance
            pool = redis.ConnectionPool.from_url(
                redis_url,
                decode_responses=True,
                max_connections=20,
                socket_connect_timeout=5,
                socket_timeout=3,
                retry_on_timeout=True,
                health_check_interval=30,
                socket_keepalive=True,
                socket_keepalive_options={
                    1: 1,    # TCP_KEEPIDLE
                    2: 10,   # TCP_KEEPINTVL  
                    3: 3     # TCP_KEEPCNT
                } if os.name != 'nt' else {}
            )
            
            self._client = redis.Redis(connection_pool=pool)
            self._client.ping()
            self._available = True
            logger.info("✅ Redis connected successfully")
        except redis.ConnectionError as e:
            logger.warning(f"Redis connection failed: {e}")
            self._available = False
            self._last_error = str(e)
        except Exception as e:
            logger.warning(f"Redis initialization error: {e}")
            self._available = False
            self._last_error = str(e)
    
    def _ensure_connected(self) -> bool:
        """Check connection and attempt reconnect if needed."""
        if self._available and self._client:
            return True
        
        # Throttle reconnection attempts
        now = time.time()
        if now - self._last_reconnect_attempt < self._reconnect_interval:
            return False
        
        self._last_reconnect_attempt = now
        
        try:
            if self._client:
                self._client.ping()
                self._available = True
                logger.info("✅ Redis reconnected")
                return True
        except Exception:
            pass
        
        # Try full re-initialization
        self._initialize()
        return self._available
    
    @property
    def available(self):
        return self._available and self._client is not None
    
    def _execute(self, operation, *args, **kwargs):
        """Execute Redis command with error handling and auto-reconnect."""
        if not self._ensure_connected():
            return None
        
        try:
            result = operation(*args, **kwargs)
            return result
        except redis.ConnectionError as e:
            logger.warning(f"Redis connection lost: {e}")
            self._available = False
            self._last_error = str(e)
            return None
        except redis.TimeoutError as e:
            logger.warning(f"Redis timeout: {e}")
            return None
        except redis.RedisError as e:
            logger.error(f"Redis error: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected Redis error: {e}")
            return None
    
    # ── Core Operations ──
    def get(self, key):
        return self._execute(self._client.get, key) if self.available else None
    
    def set(self, key, value, ex=None, nx=False):
        if not self.available:
            return False
        return self._execute(self._client.set, key, value, ex=ex, nx=nx)
    
    def setex(self, key, seconds, value):
        if not self.available:
            return False
        return self._execute(self._client.setex, key, seconds, value)
    
    def setnx(self, key, value):
        """Set if not exists (for locking)."""
        if not self.available:
            return False
        return self._execute(self._client.setnx, key, value)
    
    def delete(self, *keys):
        if not self.available:
            return 0
        return self._execute(self._client.delete, *keys) or 0
    
    def incr(self, key):
        return self._execute(self._client.incr, key) if self.available else None
    
    def expire(self, key, seconds):
        if not self.available:
            return False
        return self._execute(self._client.expire, key, seconds)
    
    def ttl(self, key):
        return self._execute(self._client.ttl, key) if self.available else -2
    
    def exists(self, *keys):
        return self._execute(self._client.exists, *keys) if self.available else 0
    
    def ping(self):
        if not self._client:
            return False
        try:
            result = self._client.ping()
            self._available = True
            return result
        except Exception:
            self._available = False
            return False
    
    # ── Pipeline Support ──
    def pipeline(self):
        """Create a pipeline for batch operations."""
        if not self.available:
            return None
        return self._client.pipeline()
    
    # ── Health Info ──
    def health(self):
        return {
            'available': self.available,
            'last_error': self._last_error,
            'ping': self.ping() if self.available else False
        }


# Global singleton
redis_client = RedisClient()