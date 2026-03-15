import { Request, Response, Mail, config, Log, lang, DB, view } from 'arikajs';
import { User } from '@Models/User';
import { ResetPassword } from '@Mail/Auth/ResetPassword';
import * as crypto from 'crypto';

export class ForgotPasswordController {
    /**
     * Show the form to request a password reset link.
     */
    public async showLinkRequestForm(req: Request, res: Response) {
        return await view('auth.passwords.email', { error: null, success: null });
    }

    /**
     * Send a reset link to the given user.
     */
    public async sendResetLinkEmail(req: Request, res: Response) {
        const { email } = await req.validate({
            email: 'required|email'
        });
        
        const user = await User.where('email', email).first() as User | null;

        if (!user) {
            return await view('auth.passwords.email', { 
                error: lang('auth.user_not_found'), 
                success: null 
            });
        }

        if (!user.email_verified_at) {
            return await view('auth.passwords.email', { 
                error: lang('auth.email_not_verified'), 
                success: null 
            });
        }

        const token = crypto.randomBytes(32).toString('hex');
        await DB.table('password_resets').where('email', email).delete();
        await DB.table('password_resets').insert({
            email,
            token,
            created_at: new Date()
        });

        const appName = config('app.name', 'ArikaJS App');
        const appUrl = config('app.url', 'http://localhost:3000');
        const resetUrl = appUrl + '/auth/password/reset/' + token + '?email=' + encodeURIComponent(email);
        try {
            await Mail.to(email).send(new ResetPassword(resetUrl, appName));
        } catch (e) {
            Log.error('Failed to send reset email', { error: (e as Error).message, email });
        }
        
        return await view('auth.passwords.email', { 
            success: lang('auth.reset_link_sent') 
        });
    }
}