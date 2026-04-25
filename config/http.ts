import { env } from 'arikajs';

export default {
    port: env('APP_PORT', 3000),
    host: env('APP_HOST', '0.0.0.0'),

    /**
     * Security Headers Configuration
     */
    security: {
        // Content Security Policy (CSP)
        // Add domains your application needs to load assets from.
        csp: {
            'default-src': ["'self'"],
            'script-src': ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            'img-src': ["'self'", "data:"],
            'font-src': ["'self'", "https://fonts.gstatic.com"],
            'connect-src': ["'self'"]
        },
             
        hsts: env('HSTS_ENABLED', false),
        contentTypeOptions: 'nosniff',
        frameOptions: 'SAMEORIGIN',
        xssProtection: '1; mode=block',
        referrerPolicy: 'strict-origin-when-cross-origin',
    }
};
