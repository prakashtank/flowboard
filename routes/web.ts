import { Route, view } from 'arikajs';
import { LoginController } from '@Controllers/Auth/LoginController';
import { RegisterController } from '@Controllers/Auth/RegisterController';
import { ForgotPasswordController } from '@Controllers/Auth/ForgotPasswordController';
import { ResetPasswordController } from '@Controllers/Auth/ResetPasswordController';
import { VerifyEmailController } from '@Controllers/Auth/VerifyEmailController';
import { DashboardController } from '@Controllers/DashboardController';
import { BoardDetailController } from '@Controllers/BoardDetailController';

// ─── Public Landing Page ─────────────────────────────────────────────────────
Route.get('/', () => {
    return view('welcome', { name: 'FlowBoard' });
});

// ─── Authentication Routes (Web) ──────────────────────────────────────────────
Route.group({ prefix: 'auth' }, () => {
    Route.get('/login', [LoginController, 'showLogin']).as('login').withMiddleware('guest');
    Route.post('/login', [LoginController, 'login']);

    Route.get('/register', [RegisterController, 'showRegister']).withMiddleware('guest');
    Route.post('/register', [RegisterController, 'register']);

    Route.post('/logout', [LoginController, 'logout']).withMiddleware('auth:web');

    // Password Reset
    Route.get('/forgot-password', [ForgotPasswordController, 'showLinkRequestForm']);
    Route.post('/password/email', [ForgotPasswordController, 'sendResetLinkEmail']);
    Route.get('/password/reset/:token', [ResetPasswordController, 'showResetForm']);
    Route.post('/password/reset', [ResetPasswordController, 'reset']);

    // Email Verification
    Route.get('/verify', [VerifyEmailController, 'verify']);
    Route.post('/verification-notification', [VerifyEmailController, 'resend']).withMiddleware('auth:web');
});

// ─── Authenticated Web Routes ─────────────────────────────────────────────────
Route.group({ middleware: ['auth:web'] }, () => {
    Route.get('/dashboard', [DashboardController, 'index']);
    Route.get('/boards', [DashboardController, 'boards']);
    Route.get('/tasks', [DashboardController, 'tasks']);
    Route.get('/boards/:id', [BoardDetailController, 'show']);
});
