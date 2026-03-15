import { VerifyEmailController } from '@Controllers/Auth/VerifyEmailController';
import { ResetPasswordController } from '@Controllers/Auth/ResetPasswordController';
import { ForgotPasswordController } from '@Controllers/Auth/ForgotPasswordController';
import { RegisterController } from '@Controllers/Auth/RegisterController';
import { LoginController } from '@Controllers/Auth/LoginController';
import { Route, Request, Response, view } from 'arikajs';

Route.get('/', (req: Request, res: Response) => {
    return view('welcome', { name: 'ArikaApp' });
});

// Example of a protected route
// Route.get('/dashboard', (req: Request, res: Response) => {
//     return view('dashboard');
// }).withMiddleware('auth');

// Authentication Routes (Web)
Route.group({ prefix: 'auth', middleware: 'web' }, () => {
    Route.get('/login', [LoginController, 'showLogin']).as('login');
    Route.post('/login', [LoginController, 'login']);
    Route.get('/register', [RegisterController, 'showRegister']);
    Route.post('/register', [RegisterController, 'register']);
    Route.post('/logout', [LoginController, 'logout']).withMiddleware('auth:web');

    // Password Reset
    Route.get('/password/reset', [ForgotPasswordController, 'showLinkRequestForm']);
    Route.post('/password/email', [ForgotPasswordController, 'sendResetLinkEmail']);
    Route.get('/password/reset/:token', [ResetPasswordController, 'showResetForm']);
    Route.post('/password/reset', [ResetPasswordController, 'reset']);

    // Email Verification
    Route.get('/verify', [VerifyEmailController, 'verify']);
    Route.post('/verification-notification', [VerifyEmailController, 'resend']).withMiddleware('auth:web');
});

Route.get('/dashboard', [LoginController, 'showDashboard']).withMiddleware('auth:web');
