import { ServiceProvider } from 'arikajs';
import { Gate } from '@arikajs/authorization';
import { User } from '@Models/User';
import { Board } from '@Models/Board';
import { BoardPolicy } from '../Policies/BoardPolicy';

export class AuthServiceProvider extends ServiceProvider {
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
        // --- DEFINE POLICIES ---
        Gate.policy(Board, BoardPolicy);

        // --- DEFINE CUSTOM GATES ---
        Gate.define('admin-only', (user: User) => {
            return (user as any).is_admin === true;
        });

        // Example: Only board owner or member can add tasks
        Gate.define('add-task', (user: User, board: Board) => {
             return (user as any).id === (board as any).user_id;
        });
    }
}
