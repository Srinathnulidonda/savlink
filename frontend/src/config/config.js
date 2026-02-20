// src/config/config.js
const isDevelopment = import.meta.env.DEV || process.env.NODE_ENV === 'development'

export const config = {
    apiBaseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    appName: 'Savlink',
    appVersion: '1.0.0',

    features: {
        googleAuth: true,
        emailVerification: true,
        passwordReset: true,
        rememberMe: true,
    },

    tokens: {
        accessTokenKey: 'savlink_access_token',
        refreshTokenKey: 'savlink_refresh_token',
        userDataKey: 'savlink_user',
        tokenExpiry: 15 * 60 * 1000,
        refreshExpiry: 7 * 24 * 60 * 60 * 1000,
    },

    endpoints: {
        auth: {
            register: '/api/auth/register',
            login: '/api/auth/login',
            logout: '/api/auth/logout',
            refresh: '/api/auth/refresh',
            verifyEmail: '/api/auth/verify-email',
            resendVerification: '/api/auth/resend-verification',
            forgotPassword: '/api/auth/forgot-password',
            resetPassword: '/api/auth/reset-password',
            changePassword: '/api/auth/change-password',
            deleteAccount: '/api/auth/delete-account',
            profile: '/auth/me',
        },
        links: {
            base: '/api/links',
            collections: '/api/collections',
            tags: '/api/tags',
            search: '/api/links/search',
            analytics: '/api/analytics',
        },
        dashboard: {
            links: '/api/dashboard/links',
            stats: '/api/dashboard/stats'
        }
    },

    ui: {
        toastDuration: 4000,
        animationDuration: 300,
        debounceDelay: 500,
    },

    validation: {
        password: {
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumber: true,
            requireSpecial: true,
            specialCharacters: '!@#$%^&*(),.?":{}|<>\\-_=+\\[\\]\\\\;\'`~',
        },
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            maxLength: 255,
        },
        name: {
            minLength: 2,
            maxLength: 100,
        },
    },

    isDevelopment,
    isProduction: !isDevelopment,
    debug: isDevelopment,
    logLevel: isDevelopment ? 'debug' : 'error',
}

export const getApiUrl = (endpoint) => {
    const baseUrl = config.apiBaseUrl.replace(/\/$/, '');
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${cleanEndpoint}`;
}

export const log = {
    debug: (...args) => {
        if (config.debug) console.log('[DEBUG]', ...args)
    },
    info: (...args) => {
        if (config.logLevel !== 'error') console.info('[INFO]', ...args)
    },
    warn: (...args) => {
        console.warn('[WARN]', ...args)
    },
    error: (...args) => {
        console.error('[ERROR]', ...args)
    },
}

export default config