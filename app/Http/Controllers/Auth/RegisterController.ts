import { Request, Response, Log, lang, view, Hasher } from 'arikajs';
import { User } from '@Models/User';

export class RegisterController {
    /**
     * Show the registration form.
     */
    public async showRegister(req: Request, res: Response) {
        return view('auth.register');
    }

    /**
     * Handle an incoming registration request.
     */
    public async register(req: Request, res: Response) {
        const data = await req.validate({
            name: 'required|string|max:255',
            email: 'required|string|email|max:255|unique:users',
            password: 'required|string|min:8|confirmed',
        });

        const user = await User.create({
            name: data.name,
            email: data.email,
            password: await Hasher.make(data.password),
        });

        Log.info('New user registered', { email: (user as any).email });

        // Auto-login after registration for web
        if (!req.expectsJson()) {
            await req.auth.guard('web').login(user);
            return res.redirect('/dashboard');
        }

        return res.status(201).json({ 
            message: lang('auth.register_success'),
            user 
        });
    }
}
