const mysql = require('mysql2/promise');

async function checkDatabase() {
    console.log('Connecting to MySQL...');
    const connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        database: 'arikajs',
        password: ''
    });

    console.log('\n--- USERS TABLE ---');
    const [users] = await connection.execute('SELECT id, email, name FROM users');
    console.table(users);

    console.log('\n--- BOARDS TABLE ---');
    const [boards] = await connection.execute('SELECT id, user_id, title FROM boards');
    console.table(boards);

    console.log('\n--- BOARD LISTS TABLE ---');
    const [lists] = await connection.execute('SELECT id, board_id, title FROM board_lists LIMIT 5');
    console.table(lists);

    await connection.end();
}

checkDatabase().catch(console.error);
