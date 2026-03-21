import { Migration, SchemaBuilder } from 'arikajs';

export default class CreateTaskAttachmentsTable extends Migration {
    /**
     * Run the migrations.
     */
    public async up(schema: SchemaBuilder): Promise<void> {
        await schema.create('task_attachments', (table) => {
            table.id();
            table.integer('task_id');
            table.string('name');
            table.string('path');
            table.string('size');
            table.timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public async down(schema: SchemaBuilder): Promise<void> {
        await schema.dropIfExists('task_attachments');
    }
}
