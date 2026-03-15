import { Request, Response, Log, lang, Mail, config, app, view } from 'arikajs';
import { User } from '@Models/User';
import { VerifyEmail } from '@Mail/Auth/VerifyEmail';

export class VerifyEmailController {
    /**
     * Mark the authenticated user's email address as verified.
     */
    public async verify(req: Request, res: Response) {
        const { email, token } = req.all();

        if (!email || !token) {
            return res.redirect(`/auth/login?error=${encodeURIComponent(lang('auth.missing_verification_data'))}`);
        }

        const expectedToken = Buffer.from(email).toString('base64');
        if (token !== expectedToken) {
            Log.warning('Invalid email verification attempt', { email, token });
            return res.redirect(`/auth/login?error=${encodeURIComponent(lang('auth.invalid_verification_token'))}`);
        }

        const user = await User.where('email', email).first() as User | null;
        if (!user) {
            return res.redirect(`/auth/login?error=${encodeURIComponent(lang('auth.user_not_found'))}`);
        }

        if (user.email_verified_at) {
            return res.redirect(`/auth/login?success=${encodeURIComponent(lang('auth.email_already_verified'))}&email=${encodeURIComponent(email)}`);
        }

        try {
            await user.update({
                email_verified_at: new Date()
            });
        } catch (e) {
            Log.error('Email verification update failed', { error: (e as Error).message, email });
            return res.redirect(`/auth/login?error=${encodeURIComponent(lang('auth.verification_failed'))}`);
        }

        return res.redirect(`/auth/login?success=${encodeURIComponent(lang('auth.email_verified'))}&email=${encodeURIComponent(email)}`);
    }

    /**
     * Resend the email verification notification.
     */
    public async resend(req: Request, res: Response) {

        const user = await req.auth.user() as User | null;
        if (!user) {
            return res.redirect('/auth/login');
        }

        if (typeof user.hasVerifiedEmail === 'function' ? user.hasVerifiedEmail() : user.email_verified_at) {
            return res.redirect('/dashboard');
        }

        const appName = config('app.name', 'ArikaJS App');
        const appUrl = config('app.url', 'http://localhost:3000');
        const verificationUrl = appUrl + '/auth/verify?email=' + encodeURIComponent(user.email) + '&token=' + Buffer.from(user.email).toString('base64');

        try {
            await Mail.to(user.email).send(new VerifyEmail(user.name, verificationUrl, appName));
        } catch (e) {
            Log.error('Failed to send verification email', { error: (e as Error).message, email: user.email });
        }

        return res.redirect('/dashboard?success=' + encodeURIComponent('Verification link resent!'));
    }
}
