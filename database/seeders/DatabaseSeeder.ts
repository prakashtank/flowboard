import { Seeder, DatabaseManager } from '@arikajs/database';
import UserSeeder from './UserSeeder';
import BoardSeeder from './BoardSeeder';
import BoardListSeeder from './BoardListSeeder';
import TaskSeeder from './TaskSeeder';

export default class DatabaseSeeder extends Seeder {
    /**
     * Run all seeders in the correct dependency order.
     */
    public async run(db: DatabaseManager): Promise<void> {
        console.log('\n🌱 Seeding FlowBoard database...\n');

        await new UserSeeder().run(db);
        await new BoardSeeder().run(db);
        await new BoardListSeeder().run(db);
        await new TaskSeeder().run(db);

        console.log('\n✅ Database seeding complete!\n');
        console.log('📋 Demo Accounts (password: "password"):');
        console.log('   alice@flowboard.dev  — owns 2 boards');
        console.log('   bob@flowboard.dev    — owns 1 board');
        console.log('   carol@flowboard.dev  — team member\n');
    }
}
