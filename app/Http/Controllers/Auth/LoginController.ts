import { Request, Response, Log, lang, app, view } from 'arikajs';
import { User } from '@Models/User';

export class LoginController {
    /**
     * Show the application's login form.
     */
    public async showLogin(req: Request, res: Response) {
        return await view('auth.login', { 
            error: req.query('error'), 
            success: req.query('success') || req.query('message'), 
            email: req.query('email') || '' 
        });
    }

    /**
     * Handle an incoming authentication request.
     */
    public async login(req: Request, res: Response) {
        const { email, password } = await req.validate({
            email: 'required|email',
            password: 'required|string',
        });

        const credentials = { email, password };
        const result = await req.auth.attempt(credentials);

        if (!result) {
            Log.info('Failed login attempt', { email: credentials.email });
            return await view('auth.login', { 
                error: lang('auth.failed'),
                email: credentials.email 
            });
        }

        return res.redirect('/dashboard');
    }

    /**
     * Show the application dashboard.
     */
    public async showDashboard(req: Request, res: Response) {
        const user = await req.auth.user() as User | null;
        return await view('dashboard', { user: user || { name: 'User' } });
    }

    /**
     * Log the user out of the application.
     */
    public async logout(req: Request, res: Response) {
        await req.auth.logout();
        return res.redirect('/auth/login');
    }
}
