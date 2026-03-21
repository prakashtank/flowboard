import { Kernel as BaseKernel, StartSession, ViewMiddleware, BodyParserMiddleware } from 'arikajs';
import { Authenticate } from '@Middleware/Authenticate';
import { RedirectIfAuthenticated } from '@Middleware/RedirectIfAuthenticated';
import { EnsureEmailIsVerified } from '@Middleware/EnsureEmailIsVerified';
import { VerifyCsrfToken } from '@Middleware/VerifyCsrfToken';
import { TrimStrings } from '@Middleware/TrimStrings';
import { TrustProxies } from '@Middleware/TrustProxies';
import { ShareRequest } from '@Middleware/ShareRequest';
import { SecurityHeaders } from '@Middleware/SecurityHeaders';
import { MultipartMiddleware } from '@Middleware/MultipartMiddleware';

export class Kernel extends BaseKernel {
    constructor(app: any) {
        super(app);

        // Global middleware — runs on EVERY request (web + API).
        this.middleware = this.middleware.filter(m => 
            m.constructor.name !== 'SecurityHeaders' &&
            m.constructor.name !== 'BodyParserMiddleware'
        );
        
        this.middleware.push(
            new MultipartMiddleware(),
            new BodyParserMiddleware(), // Framework one still handles JSON/Encoded types
            new SecurityHeaders(),
            new TrustProxies(),
            new TrimStrings(),
        );

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
        const router = this.app.getRouter();
        router.setMiddlewareGroups(this.middlewareGroups);
        router.setRouteMiddleware(this.routeMiddleware);
    }
}
