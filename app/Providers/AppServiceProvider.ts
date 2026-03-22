import { ServiceProvider } from 'arikajs';

export class AppServiceProvider extends ServiceProvider {
    /**
     * Register any application services.
     */
    public register(): void {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * Note: The following are globally available in every ArikaJS template
     * with zero configuration — no registration needed here:
     *
     *  - String:  strtoupper, strtolower, ucfirst, ucwords, substr, trim, slug, etc.
     *  - Number:  number_format, round, floor, ceil, abs, rand, etc.
     *  - Array:   count, implode, in_array, array_merge, array_chunk, etc.
     *  - Date:    carbon(), Carbon — use carbon(date).format('M j, Y') or .diffForHumans()
     *  - Types:   is_array, is_string, is_null, empty, isset
     *  - Request: errors, old, user, _csrf (injected per-request by ViewMiddleware)
     */
    public boot(): void {
        //
    }
}

