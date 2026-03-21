import { Migration, SchemaBuilder } from 'arikajs';

export default class CreateBoardListsTable extends Migration {
    /**
     * Run the migrations.
     */
    public async up(schema: SchemaBuilder): Promise<void> {
        await schema.create('board_lists', (table) => {
            table.id();
            table.bigInteger('board_id').unsigned();
            table.foreign('board_id').references('id').on('boards').onDelete('cascade');
            table.string('title');
            table.integer('position').default(0);
            table.timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public async down(schema: SchemaBuilder): Promise<void> {
        await schema.dropIfExists('board_lists');
    }
}
