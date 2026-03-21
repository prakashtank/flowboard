import { Request, Response, Log, lang, view } from 'arikajs';
import { User } from '@Models/User';

export class LoginController {
    /**
     * Show the login form.
     */
    public async showLogin(req: Request, res: Response) {
        return view('auth.login');
    }

    /**
     * Handle an incoming authentication request.
     */
    public async login(req: Request, res: Response) {
        const credentials = await req.validate({
            email: 'required|email',
            password: 'required|string',
        });

        // Determine guard based on request type
        const guardType = req.expectsJson() ? 'api' : 'web';
        const guard = req.auth.guard(guardType);
        
        const result = await guard.attempt(credentials);

        if (!result) {
            Log.info('Failed login attempt', { email: credentials.email });
            
            if (req.expectsJson()) {
                return res.json({ error: lang('auth.failed') }, 401);
            }
            
            await req.session.flash('errors', { email: [lang('auth.failed')] });
            await req.session.flash('_old_input', req.all());
            return res.back(req);
        }

        const user = await guard.user();

        if (req.expectsJson()) {
            const access_token = typeof result === 'object' && (result as any).access_token 
                ? (result as any).access_token 
                : (typeof result === 'string' ? result : undefined);

            return res.json({ 
                message: lang('auth.login_success'),
                access_token,
                user 
            });
        }

        return res.redirect('/dashboard');
    }

    /**
     * Get the authenticated user.
     */
    public async me(req: Request, res: Response) {
        const user = await req.auth.guard('api').user() as User | null;
        if (!user) {
            return res.json({ error: lang('auth.unauthenticated') }, 401);
        }
        return res.json({ user });
    }

    /**
     * Log the user out of the application.
     */
    public async logout(req: Request, res: Response) {
        try {
            const guardType = req.expectsJson() ? 'api' : 'web';
            await req.auth.guard(guardType).logout();
        } catch (e) {
            Log.error('Logout error', { error: (e as Error).message });
        }
        
        if (req.expectsJson()) {
            return res.json({ message: lang('auth.logout_success') });
        }

        return res.redirect('/auth/login');
    }
}
