import { Seeder, DatabaseManager } from '@arikajs/database';

export default class TaskSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public async run(db: DatabaseManager): Promise<void> {
        await db.table('task_assignees').delete();
        await db.table('tasks').delete();

        const users = await db.table('users').get();
        const lists = await db.table('board_lists').get();

        if (!lists || lists.length === 0) {
            throw new Error('TaskSeeder: No lists found — run BoardListSeeder first!');
        }

        // Get the first board's lists for seeding tasks
        const firstBoardLists = lists.slice(0, 5);
        const [backlog, todo, inProgress, , done] = firstBoardLists as any[];

        const taskDefinitions = [
            // Backlog
            { board_list_id: backlog.id, title: 'Define API contracts', description: 'Document all REST endpoints and response shapes.', position: 0, due_date: null },
            { board_list_id: backlog.id, title: 'Research competitive analysis', description: 'Evaluate Trello, Linear, Jira for feature gaps.', position: 1, due_date: null },
            { board_list_id: backlog.id, title: 'Setup CI/CD pipeline', description: 'GitHub Actions workflow for build and test.', position: 2, due_date: null },

            // To Do
            { board_list_id: todo.id, title: 'Implement drag-and-drop', description: 'Allow cards to be moved between lists.', position: 0, due_date: null },
            { board_list_id: todo.id, title: 'Design system tokens', description: 'Define color palette, spacing, and typography.', position: 1, due_date: null },

            // In Progress
            { board_list_id: inProgress.id, title: 'Build authentication flow', description: 'Login, register, forgot password with session guard.', position: 0, due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
            { board_list_id: inProgress.id, title: 'Board CRUD API', description: 'REST endpoints for managing boards.', position: 1, due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },

            // Done
            { board_list_id: done.id, title: 'Project scaffolding', description: 'Initialize ArikaJS project with CLI.', position: 0, due_date: null },
            { board_list_id: done.id, title: 'Database schema design', description: 'Design and migrate all tables.', position: 1, due_date: null },
        ];

        // SQLite might have issues with loop insert if keys are slightly different or something?
        // Let's use bulk for tasks, then fetch back to assign users.
        const now = new Date();
        const bulkTasks = taskDefinitions.map(t => ({
            ...t,
            created_at: now,
            updated_at: now
        }));

        await db.table('tasks').insert(bulkTasks);

        // Fetch back inserted tasks to get IDs
        const insertedTasks = await db.table('tasks').get();

        const aliceId = (users[0] as any).id;
        const bobId   = (users[1] as any).id;
        const carolId = (users[2] as any).id;

        const assignees: any[] = [];

        // Assign to "In Progress" tasks
        const inProgressTaskObjs = insertedTasks.filter(t => t.board_list_id === inProgress.id);
        for (const task of inProgressTaskObjs) {
            assignees.push(
                { task_id: (task as any).id, user_id: aliceId, created_at: now, updated_at: now },
                { task_id: (task as any).id, user_id: bobId,   created_at: now, updated_at: now }
            );
        }

        // Assign to a backlog task
        const backlogTask = insertedTasks.find(t => t.board_list_id === backlog.id);
        if (backlogTask) {
            assignees.push({
                task_id: (backlogTask as any).id,
                user_id: carolId,
                created_at: now,
                updated_at: now
            });
        }

        if (assignees.length > 0) {
            await db.table('task_assignees').insert(assignees);
        }

        console.log(`✔ TaskSeeder: ${insertedTasks.length} tasks created, ${assignees.length} assignees set.`);
    }
}
