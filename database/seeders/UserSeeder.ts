import { Seeder, DatabaseManager } from '@arikajs/database';
import bcrypt from 'bcryptjs';

export default class UserSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public async run(db: DatabaseManager): Promise<void> {
        const hashedPassword = await bcrypt.hash('password', 10);

        // Clear existing users
        await db.table('users').delete();

        await db.table('users').insert([
            {
                name: 'Alice Johnson',
                email: 'alice@flowboard.dev',
                password: hashedPassword,
                email_verified_at: new Date(),
                remember_token: null,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Bob Smith',
                email: 'bob@flowboard.dev',
                password: hashedPassword,
                email_verified_at: new Date(),
                remember_token: null,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Carol White',
                email: 'carol@flowboard.dev',
                password: hashedPassword,
                email_verified_at: new Date(),
                remember_token: null,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);

        console.log('✔ UserSeeder: 3 users created (password: "password")');
    }
}
