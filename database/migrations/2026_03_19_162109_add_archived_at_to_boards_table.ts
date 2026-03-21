import { Migration, SchemaBuilder } from 'arikajs';

export default class AddArchivedAtToBoardsTable extends Migration {
    /**
     * Run the migrations.
     */
    public async up(schema: SchemaBuilder): Promise<void> {
        await schema.table('boards', (table) => {
            table.timestamp('archived_at').nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public async down(schema: SchemaBuilder): Promise<void> {
        await schema.table('boards', (table) => {
            table.dropColumn('archived_at');
        });
    }
}
