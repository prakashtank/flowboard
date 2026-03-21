import { Migration, SchemaBuilder } from 'arikajs';

export default class CreateBoardsTable extends Migration {
    /**
     * Run the migrations.
     */
    public async up(schema: SchemaBuilder): Promise<void> {
        await schema.create('boards', (table) => {
            table.id();
            table.string('title');
            table.text('description').nullable();
            table.string('color').nullable();
            table.bigInteger('user_id').unsigned();
            table.foreign('user_id').references('id').on('users').onDelete('cascade');
            table.timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public async down(schema: SchemaBuilder): Promise<void> {
        await schema.dropIfExists('boards');
    }
}
