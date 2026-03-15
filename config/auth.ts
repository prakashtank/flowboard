import { User } from '@Models/User';

export default {
    default: 'web',
    guards: {
        web: {
            driver: 'session',
            provider: 'users',
        },
        api: {
            driver: 'jwt',
            provider: 'users',
            secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
            options: {
                expiresIn: '24h',
            },
        },
    },
    providers: {
        users: {
            driver: 'eloquent',
            model: User,
        },
    },
    lockout: {
        maxAttempts: 5,
        decayMinutes: 15,
    },
};
