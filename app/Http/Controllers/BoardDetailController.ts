import { Request, Response, view } from 'arikajs';
import { Board } from '@Models/Board';
import { BoardList } from '@Models/BoardList';
import { Task } from '@Models/Task';

export class BoardDetailController {
    /**
     * Show a single board details (Kanban UI).
     */
    public async show(req: Request, res: Response) {
        const user = await req.auth.user();
        if (!user) {
            return res.redirect('/auth/login');
        }

        const board = await Board.where('id', '=', req.param('id'))
            .where('user_id', '=', (user as any).id)
            .first();

        if (!board) {
            return res.status(404).json({ message: 'Board not found.' });
        }

        const lists = await BoardList.where('board_id', '=', (board as any).id)
            .orderBy('position', 'asc')
            .get();

        // Fetch tasks for all lists and group them (eager load attachments/assignees)
        const listIds = lists.map((l: any) => l.id);
        const allTasks = listIds.length > 0 
            ? await Task.whereIn('board_list_id', listIds)
                 .with(['attachments', 'assignees'])
                 .orderBy('position', 'asc')
                 .get()
            : [];

        // Attach tasks to lists for easier rendering in view
        const listsWithTasks = lists.map((list: any) => {
            const listObj = (list as any).toJSON ? (list as any).toJSON() : list;
            return {
                ...listObj,
                tasks: allTasks.filter((t: any) => t.board_list_id === list.id)
            };
        });

        return view('boards.show', {
            board,
            lists: listsWithTasks,
            user
        });
    }
}
