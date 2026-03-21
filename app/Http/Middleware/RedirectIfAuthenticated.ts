import { Request, Response } from 'arikajs';

export class RedirectIfAuthenticated {
    /**
     * Handle an incoming request.
     */
    public async handle(request: any, next: (request: any) => Promise<Response>, response: Response, ...guards: (string | undefined)[]): Promise<Response> {
        // If no guards provided, use web as default for standard web redirection
        const authGuards = guards.length > 0 ? guards : ['web'];

        for (const guardName of authGuards) {
            // Ensure guardName is not accidentally an object (dispatcher edge case)
            const name = typeof guardName === 'string' ? guardName : 'web';
            
            if (await request.auth.guard(name).check()) {
                return response.redirect('/dashboard');
            }
        }

        return await next(request);
    }
}
