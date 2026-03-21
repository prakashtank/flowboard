import { Migration, SchemaBuilder } from 'arikajs';

export default class CreateTasksTable extends Migration {
    /**
     * Run the migrations.
     */
    public async up(schema: SchemaBuilder): Promise<void> {
        await schema.create('tasks', (table) => {
            table.id();
            table.bigInteger('board_list_id').unsigned();
            table.foreign('board_list_id').references('id').on('board_lists').onDelete('cascade');
            table.string('title');
            table.text('description').nullable();
            table.integer('position').default(0);
            table.timestamp('due_date').nullable();
            table.timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public async down(schema: SchemaBuilder): Promise<void> {
        await schema.dropIfExists('tasks');
    }
}
