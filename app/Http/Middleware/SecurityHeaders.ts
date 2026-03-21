import { Request, Response, Middleware } from 'arikajs';

/**
 * Custom Security Headers middleware to allow CDNs for frontend libraries.
 */
export class SecurityHeaders implements Middleware {
    /**
     * Handle the incoming request.
     */
    public async handle(
        request: Request,
        next: (request: Request) => Promise<Response> | Response
    ): Promise<Response> {
        const res = await next(request);

        res.header('X-Content-Type-Options', 'nosniff');
        res.header('X-Frame-Options', 'SAMEORIGIN');
        res.header('X-XSS-Protection', '1; mode=block');
        res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
        res.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

        if (process.env.NODE_ENV === 'production') {
            res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        }

        res.header(
            'Content-Security-Policy',
            "default-src 'self'; " +
            "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
            "img-src 'self' data:; " +
            "font-src 'self' https://fonts.gstatic.com; " +
            "connect-src 'self'"
        );

        return res;
    }
}
