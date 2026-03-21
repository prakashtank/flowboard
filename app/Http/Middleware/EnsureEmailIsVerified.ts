import { Request, Response, Middleware } from 'arikajs';

export class EnsureEmailIsVerified implements Middleware {
    /**
     * Handle an incoming request.
     */
    public async handle(request: any, next: (request: any) => Promise<Response>, response: Response): Promise<Response> {
        const user = await request.auth.user();

        if (!user || (typeof user.hasVerifiedEmail === 'function' && !user.hasVerifiedEmail())) {
            return request.expectsJson()
                ? response.json({ message: 'Your email address is not verified.' }, 403)
                : response.redirect('/auth/verify');
        }

        return await next(request);
    }
}
