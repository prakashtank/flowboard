import { ServiceProvider, Command } from 'arikajs';
import { CommandRegistry } from '@arikajs/console';
import { PruneArchivedBoards } from '@Console/Commands/PruneArchivedBoards';

export class ConsoleServiceProvider extends ServiceProvider {
    /**
     * All the application's console commands.
     * Add new commands here to make them available via the CLI.
     */
    protected commands: (new () => Command)[] = [
        PruneArchivedBoards,
    ];

    public register(): void {
        //
    }

    public boot(): void {
        // If running in CLI context, register our commands with the registry
        if ((this.app as any).has(CommandRegistry)) {
            const registry = (this.app as any).make(CommandRegistry);
            for (const command of this.commands) {
                registry.register(command);
            }
        }
    }
}
