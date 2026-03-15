export default {
    /**
     * Default session driver.
     * Supported: "memory", "file"
     * Set SESSION_DRIVER in your .env file.
     */
    driver: process.env.SESSION_DRIVER || 'file',

    /**
     * Session lifetime in minutes.
     * After this period, idle sessions are expired.
     */
    lifetime: Number(process.env.SESSION_LIFETIME) || 120,

    /**
     * Session cookie name.
     */
    cookie: process.env.SESSION_COOKIE || 'arika_session',

    /**
     * Cookie path — typically '/' for all routes.
     */
    path: '/',

    /**
     * Storage path for the file driver.
     */
    storagePath: './storage/sessions',

    /**
     * Mark the session cookie as Secure (HTTPS only).
     * Enable this in production.
     */
    secure: process.env.SESSION_SECURE === 'true',

    /**
     * Mark the session cookie as HttpOnly (not accessible to JS).
     */
    httpOnly: true,

    /**
     * SameSite cookie attribute.
     * Options: 'Lax', 'Strict', 'None'
     */
    sameSite: 'Lax',

    /**
     * Enable session locking to prevent race conditions.
     */
    locking: false,

    /**
     * Lock timeout in seconds.
     */
    lockTimeout: 10,

    /**
     * Garbage collection probability.
     * 0.01 = 1% of requests will trigger GC.
     */
    gcProbability: 0.01,
};
