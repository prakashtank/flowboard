import { Route, app } from 'arikajs';
import { UserController } from '@Controllers/UserController';
import { BoardController } from '@Http/Controllers/BoardController';
import { BoardListController } from '@Http/Controllers/BoardListController';
import { TaskController } from '@Http/Controllers/TaskController';
import { TaskAttachmentController } from '@Http/Controllers/TaskAttachmentController';
import { CreateTaskRequest, UpdateTaskRequest } from '../app/Http/Requests/TaskRequest';
import { BoardRequest } from '../app/Http/Requests/BoardRequest';

import { LoginController } from '@Controllers/Auth/LoginController';
import { RegisterController } from '@Controllers/Auth/RegisterController';
import { ForgotPasswordController } from '@Controllers/Auth/ForgotPasswordController';
import { ResetPasswordController } from '@Controllers/Auth/ResetPasswordController';
import { VerifyEmailController } from '@Controllers/Auth/VerifyEmailController';

// ─── Public Routes ───────────────────────────────────────────────────────────

Route.get('/', () => {
    return {
        framework: 'ArikaJS',
        version: app().version(),
        app: 'FlowBoard',
        type: 'Project Management API',
        status: 'Online',
        message: 'Welcome to FlowBoard — a showcase app built with ArikaJS.',
        links: {
            docs: 'https://github.com/arikajs/arikajs#readme',
        }
    };
});

Route.get('/status', () => {
    return {
        status: 'UP',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    };
});

// ─── Authentication Routes (API) ──────────────────────────────────────────────
Route.group({ prefix: 'auth' }, () => {
    Route.post('/register', [RegisterController, 'register']);
    Route.post('/login', [LoginController, 'login']);
    Route.post('/logout', [LoginController, 'logout']).withMiddleware('auth:api');

    // Email Verification
    Route.get('/verify', [VerifyEmailController, 'verify']);
    Route.post('/verification-notification', [VerifyEmailController, 'resend']).withMiddleware('auth:api');

    // Password Reset
    Route.post('/password/email', [ForgotPasswordController, 'sendResetLinkEmail']);
    Route.post('/password/reset', [ResetPasswordController, 'reset']);
});

Route.get('/user', [LoginController, 'me']).withMiddleware('auth:api');

// ─── Authenticated Routes ─────────────────────────────────────────────────────

Route.get('/boards', [BoardController, 'index']);

Route.group({ middleware: ['auth:web,api'] }, () => {

    // Me
    Route.get('/me', async (req: any) => await req.auth.user());

    // Users (for assignee lookup)
    Route.get('/users', [UserController, 'index']);

    // ── Boards ────────────────────────────────────────────────────────────────
    Route.get('/boards', [BoardController, 'index']);
    Route.post('/boards', [BoardController, 'store']).validateWith(BoardRequest);
    Route.get('/boards/:id', [BoardController, 'show']);
    Route.put('/boards/:id', [BoardController, 'update']).validateWith(BoardRequest);
    Route.post('/boards/:id/archive', [BoardController, 'archive']);
    Route.delete('/boards/:id', [BoardController, 'destroy']);

    // ── Lists (nested under boards) ───────────────────────────────────────────
    Route.get('/boards/:id/lists', [BoardListController, 'index']);
    Route.post('/boards/:id/lists', [BoardListController, 'store']);
    Route.put('/boards/:id/lists/:listId', [BoardListController, 'update']);
    Route.delete('/boards/:id/lists/:listId', [BoardListController, 'destroy']);

    // ── Tasks ─────────────────────────────────────────────────────────────────
    Route.get('/tasks/:id', [TaskController, 'show']);
    Route.get('/lists/:listId/tasks', [TaskController, 'index']);
    Route.post('/lists/:listId/tasks', [TaskController, 'store']).validateWith(CreateTaskRequest);
    Route.put('/tasks/:id', [TaskController, 'update']).validateWith(UpdateTaskRequest);
    Route.delete('/tasks/:id', [TaskController, 'destroy']);

    // ── Task Attachments ──────────────────────────────────────────────────────────
    Route.post('/tasks/:id/attachments', [TaskAttachmentController, 'store']);
    Route.delete('/attachments/:id', [TaskAttachmentController, 'destroy']);

    // ── Task Assignees ────────────────────────────────────────────────────────
    Route.post('/tasks/:id/assign', [TaskController, 'assign']);
    Route.delete('/tasks/:id/assign/:userId', [TaskController, 'unassign']);
});
