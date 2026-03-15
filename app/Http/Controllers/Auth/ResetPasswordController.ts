import { Request, Response, Hasher, lang, DB, view } from 'arikajs';
import { User } from '@Models/User';

export class ResetPasswordController {
    /**
     * Display the password reset view for the given token.
     */
    public async showResetForm(req: Request, res: Response) {
        return await view('auth.passwords.reset', { 
            token: req.param('token', ''),
            error: null 
        });
    }

    /**
     * Reset the given user's password.
     */
    public async reset(req: Request, res: Response) {
        const { email, password, token } = await req.validate({
            token: 'required|string',
            email: 'required|email',
            password: 'required|string|min:8|confirmed'
        });
        
        const resetRecord = await DB.table('password_resets').where('email', email).where('token', token).first();
        if (!resetRecord) {
            return await view('auth.passwords.reset', { 
                error: lang('auth.invalid_reset_token'),
                token 
            });
        }

        const user = await User.where('email', email).first() as User | null;
        if (!user) {
            return await view('auth.passwords.reset', { 
                error: lang('auth.user_not_found'),
                token 
            });
        }

        if (!user.email_verified_at) {
            return await view('auth.passwords.reset', { 
                error: lang('auth.email_not_verified'),
                token 
            });
        }

        await user.update({ password: await Hasher.make(password) });
        await DB.table('password_resets').where('email', email).delete();
        
        return res.redirect(`/auth/login?success=${encodeURIComponent(lang('auth.password_reset_success'))}`);
    }
}
