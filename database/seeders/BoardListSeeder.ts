import { Seeder, DatabaseManager } from '@arikajs/database';

export default class BoardListSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public async run(db: DatabaseManager): Promise<void> {
        await db.table('board_lists').delete();

        const boards = await db.table('boards').get();
        if (!boards || boards.length === 0) {
            throw new Error('BoardListSeeder: No boards found — run BoardSeeder first!');
        }

        const listData: any[] = [];

        // Standard kanban columns for every board
        const columns = ['Backlog', 'To Do', 'In Progress', 'In Review', 'Done'];

        for (const board of boards) {
            columns.forEach((title, position) => {
                listData.push({
                    board_id: (board as any).id,
                    title,
                    position,
                    created_at: new Date(),
                    updated_at: new Date(),
                });
            });
        }

        await db.table('board_lists').insert(listData);
        console.log(`✔ BoardListSeeder: ${listData.length} lists created (5 per board).`);
    }
}
