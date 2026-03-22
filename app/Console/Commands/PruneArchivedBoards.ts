import { Command, DB, Log } from 'arikajs';

export class PruneArchivedBoards extends Command {

    public signature: string = 'boards:prune';

    public description: string = 'Delete archived boards that are older than the specified number of days.';

    public async handle(): Promise<void> {

        const days = this.option('days', 30);
        const dryRun = this.option('dry-run', false);

        this.info(`Pruning boards archived more than ${days} day(s) ago...`);

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const query = DB.table('boards')
            .where('archived_at', '<', cutoffDate)
            .whereNotNull('archived_at');

        if (dryRun) {
            const count = await query.count();
            this.warning(`[Dry Run] Would delete ${count} board(s). No changes were made.`);
            return;
        }

        const deletedCount = await query.delete();

        if (deletedCount > 0) {
            this.success(`Successfully deleted ${deletedCount} archived board(s).`);
            Log.info(`boards:prune deleted ${deletedCount} archived boards older than ${days} days.`);
        } else {
            this.info('No archived boards found matching the criteria. Nothing was deleted.');
        }
    }
}
