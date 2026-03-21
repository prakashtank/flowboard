import { Migration, SchemaBuilder } from 'arikajs';

export default class CreateTaskAssigneesTable extends Migration {
    /**
     * Run the migrations.
     */
    public async up(schema: SchemaBuilder): Promise<void> {
        await schema.create('task_assignees', (table) => {
            table.id();
            table.bigInteger('task_id').unsigned();
            table.foreign('task_id').references('id').on('tasks').onDelete('cascade');
            table.bigInteger('user_id').unsigned();
            table.foreign('user_id').references('id').on('users').onDelete('cascade');
            table.timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public async down(schema: SchemaBuilder): Promise<void> {
        await schema.dropIfExists('task_assignees');
    }
}
