import { Seeder, DatabaseManager } from '@arikajs/database';

export default class BoardSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public async run(db: DatabaseManager): Promise<void> {
        await db.table('boards').delete();

        // Get user IDs
        const alice = await db.table('users').where('email', 'alice@flowboard.dev').first();
        const bob   = await db.table('users').where('email', 'bob@flowboard.dev').first();

        if (!alice || !bob) {
            throw new Error('BoardSeeder: Users not found — run UserSeeder first!');
        }

        await db.table('boards').insert([
            {
                title: 'Product Roadmap',
                description: 'High-level product planning and feature development.',
                color: '#6366f1',
                user_id: (alice as any).id,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                title: 'Marketing Sprint Q2',
                description: 'Campaign planning for Q2 2026.',
                color: '#f59e0b',
                user_id: (alice as any).id,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                title: 'Engineering Backlog',
                description: 'Bug fixes and technical debt.',
                color: '#10b981',
                user_id: (bob as any).id,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);

        console.log('✔ BoardSeeder: 3 boards created.');
    }
}
