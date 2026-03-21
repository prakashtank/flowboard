import { Request, Response, view, DB } from 'arikajs';
import { Board } from '@Models/Board';

export class DashboardController {
    /**
     * Show the application dashboard summary.
     */
    public async index(req: Request, res: Response) {
        const user = await req.auth.user();
        if (!user) return res.redirect('/auth/login');

        const userId = (user as any).id;

        // 1. Fetch 3 Most Recent Boards
        const recentBoards = await Board.where('user_id', '=', userId)
            .orderBy('updated_at', 'desc')
            .limit(3)
            .get();

        // 2. Fetch 5 Recent/Urgent Tasks
        const db = await DB.connection();
        const upcomingTasks = await db.query(`
            SELECT tasks.*, boards.title as board_title, boards.id as board_id
            FROM tasks
            JOIN task_assignees ON tasks.id = task_assignees.task_id
            JOIN board_lists ON board_lists.id = tasks.board_list_id
            JOIN boards ON boards.id = board_lists.board_id
            WHERE task_assignees.user_id = ?
            ORDER BY tasks.updated_at DESC
            LIMIT 5
        `, [userId]);

        // 3. Stats
        const boardCount = await Board.where('user_id', '=', userId).count();
        const taskCount = await DB.table('task_assignees').where('user_id', '=', userId).count();

        return view('dashboard', { 
            recentBoards, 
            upcomingTasks, 
            stats: { boardCount, taskCount },
            user 
        });
    }

    /**
     * Show all boards in a grid view.
     */
    public async boards(req: Request, res: Response) {
        const user = await req.auth.user();
        if (!user) return res.redirect('/auth/login');

        const boards = await Board.where('user_id', '=', (user as any).id)
            .orderBy('title', 'asc')
            .get();

        return view('boards.index', { boards, user });
    }

    /**
     * Show all assigned tasks in a list view.
     */
    public async tasks(req: Request, res: Response) {
        const user = await req.auth.user();
        if (!user) return res.redirect('/auth/login');

        const db = await DB.connection();
        const tasks = await db.query(`
            SELECT tasks.*, boards.title as board_title, boards.id as board_id
            FROM tasks
            JOIN task_assignees ON tasks.id = task_assignees.task_id
            JOIN board_lists ON board_lists.id = tasks.board_list_id
            JOIN boards ON boards.id = board_lists.board_id
            WHERE task_assignees.user_id = ?
            ORDER BY tasks.updated_at DESC
        `, [(user as any).id]);

        return view('tasks.index', { tasks, user });
    }
}
