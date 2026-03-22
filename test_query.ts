import { resolve } from 'path';
import 'dotenv/config';
import { Database, DatabaseManager } from '@arikajs/database';
import { Board } from './app/Models/Board';

async function test() {
    const manager = new DatabaseManager({
        default: process.env.DB_CONNECTION || 'mysql',
        connections: {
            mysql: {
                driver: 'mysql',
                host: process.env.DB_HOST || '127.0.0.1',
                port: Number(process.env.DB_PORT) || 3306,
                database: process.env.DB_DATABASE || 'arikajs',
                username: process.env.DB_USERNAME || 'root',
                password: process.env.DB_PASSWORD || '',
            }
        }
    });
    Database.setManager(manager);

    const user4Boards = await Board.where('user_id', '=', 4).get();
    console.log('Boards for User 4:', user4Boards);

    const allBoards = await Database.getManager().table('boards').get();
    console.log('All Boards:', allBoards);
    
    process.exit(0);
}

test().catch(console.error);
