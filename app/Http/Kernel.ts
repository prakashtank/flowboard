import { Kernel as BaseKernel, StartSession, ViewMiddleware, BodyParserMiddleware, ServeStaticMiddleware } from 'arikajs';
import { Authenticate } from '@Middleware/Authenticate';
import { RedirectIfAuthenticated } from '@Middleware/RedirectIfAuthenticated';
import { EnsureEmailIsVerified } from '@Middleware/EnsureEmailIsVerified';
import { VerifyCsrfToken } from '@Middleware/VerifyCsrfToken';
import { TrimStrings } from '@Middleware/TrimStrings';
import { TrustProxies } from '@Middleware/TrustProxies';
import { ShareRequest } from '@Middleware/ShareRequest';
import { SecurityHeaders } from '@Middleware/SecurityHeaders';

export class Kernel extends BaseKernel {
    constructor(app: any) {
        super(app);

        // Global middleware — runs on EVERY request (web + API).
        this.middleware = [
            new ServeStaticMiddleware(),  // Serve public/ assets (CSS, JS, images) — MUST be first
            new BodyParserMiddleware(), // Framework handles JSON, Form-data, and Multipart
            new SecurityHeaders(),
            new TrustProxies(),
            new TrimStrings(),
        ];

        // Middleware groups — 'web' and 'api' groups.
        Object.assign(this.middlewareGroups, {
            web: [
                StartSession,
                ViewMiddleware,
                ShareRequest,
                new VerifyCsrfToken(),
            ],
            api: [
                StartSession,
                'throttle:120,60',
            ],
        });

        // Named route middleware — aliases.
        Object.assign(this.routeMiddleware, {
            'auth': Authenticate,
            'guest': RedirectIfAuthenticated,
            'verified': EnsureEmailIsVerified,
        });

        // Sync with router
        const router = (this as any).app.getRouter();
        router.setMiddlewareGroups(this.middlewareGroups);
        router.setRouteMiddleware(this.routeMiddleware);
    }
}
