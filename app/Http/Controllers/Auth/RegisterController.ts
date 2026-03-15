import { Request, Response, Mail, Hasher, config, Log, app, view } from 'arikajs';
import { User } from '@Models/User';
import { VerifyEmail } from '@Mail/Auth/VerifyEmail';

export class RegisterController {
    public async showRegister(req: Request, res: Response) {
        return await view('auth.register', { error: null, success: null, old: {} });
    }

    public async register(req: Request, res: Response) {
        const { name, email, password } = await req.validate({
            name: 'required|string|min:2',
            email: 'required|email',
            password: 'required|string|min:8|confirmed',
        });

        const hashedPassword = await Hasher.make(password);
        const user = await User.create({ name, email, password: hashedPassword });

        const appName = config('app.name', 'ArikaJS App');
        const appUrl = config('app.url', 'http://localhost:3000');
        const verificationUrl = appUrl + '/auth/verify?email=' + encodeURIComponent(email) + '&token=' + Buffer.from(email).toString('base64');

        try {
            await Mail.to(email).send(new VerifyEmail(name, verificationUrl, appName));
        } catch (e) {
            Log.error('Failed to send verification email', { error: (e as Error).message, email });
        }

        await req.auth.login(user);

        return await view('auth.register', { 
            success: 'Registration successful! You are now logged in.',
            user,
            old: {}
        });
    }
}