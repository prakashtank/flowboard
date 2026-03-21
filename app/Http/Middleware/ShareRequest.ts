import { Request, Response } from 'arikajs';

export class ShareRequest {
    public async handle(request: any, next: (request: any) => Promise<any>): Promise<any> {
        // Share a wrapper around the request object with the view engine
        if (request.view) {
            const viewRequest = {
                path: () => request.path(),
                url: () => request.baseUrl() + request.path(),
                is: (pattern: string) => {
                    const current = request.path().replace(/^\//, '');
                    const cleanPattern = pattern.replace(/^\//, '');
                    if (cleanPattern.endsWith('*')) {
                        return current.startsWith(cleanPattern.slice(0, -1));
                    }
                    return current === cleanPattern;
                },
                method: () => request.method(),
                all: () => request.all()
            };
            request.view.share('request', viewRequest);

            // Pre-resolve the user to avoid async issues in templates
            if (request.auth) {
                try {
                    const user = await request.auth.user();
                    if (user) {
                        request.view.share('user', user);
                    } else {
                        request.view.share('user', { name: 'Guest', email: '' });
                    }
                } catch (e) {
                    request.view.share('user', { name: 'Guest', email: '' });
                }
            }
        }

        return await next(request);
    }
}
