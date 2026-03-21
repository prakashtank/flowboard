import { ServiceProvider, Scheduler, Schedule, DB, Log } from 'arikajs';

export class AppServiceProvider extends ServiceProvider {
    /**
     * Register any application services.
     */
    public register(): void {
        // 
    }

    /**
     * Bootstrap any application services.
     */
    public boot(): void {
        // --- CONFIGURE STORAGE ---
        const { Storage } = require('@arikajs/storage');
        const filesystems = require('../../config/filesystems').default;
        (Storage as any).config = filesystems;

        // --- CONFIGURE VIEW ---
        const view = (this.app as any).make('view');
        view.helper('auth', () => (this.app as any).make('auth'));
        view.helper('session', () => (this.app as any).make('session'));
        view.helper('strtoupper', (val: string) => val?.toUpperCase() || '');
        view.helper('substr', (val: string, start: number, length?: number) => val?.substring(start, length) || '');
        
        view.helper('date', (date: Date, format: string) => {
            if (!(date instanceof Date) || isNaN(date.getTime())) return 'Invalid Date';
            
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const j = date.getDate();
            const M = months[date.getMonth()];
            const Y = date.getFullYear();
            
            return format.replace('M', M).replace('j', j.toString()).replace('Y', Y.toString());
        });

        // Error Bag helper for templates
        view.helper('errors', () => {
            try {
                const req = (this.app as any).make('request');
                const session = req.session;
                if (!session) return { any: () => false, all: () => [], first: () => null, has: () => false };
                const data = (session as any)._data || {};
                const errors = data['errors'] || {};
                return {
                    any: () => Object.keys(errors).length > 0,
                    all: () => Object.values(errors).flat(),
                    first: (field: string) => errors[field]?.[0] || null,
                    has: (field: string) => !!errors[field]
                };
            } catch (e) {
                return { any: () => false, all: () => [], first: () => null, has: () => false };
            }
        });

        // Old Input helper for templates
        view.helper('old', (key: string, defaultValue = '') => {
            try {
                const req = (this.app as any).make('request');
                const session = req.session;
                if (!session) return defaultValue;
                const data = (session as any)._data || {};
                const inputs = data['_old_input'] || {};
                return inputs[key] || defaultValue;
            } catch (e) {
                return defaultValue;
            }
        });

        // --- SCHEDULING ---
        const scheduler = (this.app as any).make(Scheduler);
        scheduler.define((schedule: Schedule) => {
            // Cleanup archived boards older than 30 days every night
            schedule.call(async () => {
                Log.info('Running scheduled cleanup: Deleting old archived boards...');
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

                const deletedCount = await DB.table('boards')
                    .where('archived_at', '<', thirtyDaysAgo)
                    .delete();
                
                if (deletedCount > 0) {
                    Log.info(`Cleanup finished: Deleted ${deletedCount} boards.`);
                }
            }).dailyAt('00:00');
        });
    }
}
