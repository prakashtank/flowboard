import { Request, Response, Queue, Event } from 'arikajs';
import { Gate } from '@arikajs/authorization';
import { Task } from '@Models/Task';
import { TaskAssignee } from '@Models/TaskAssignee';
import { User } from '@Models/User';
import { Board } from '@Models/Board';
import { BoardList } from '@Models/BoardList';
import { SendAssigneeNotificationJob } from '../../Jobs/SendAssigneeNotificationJob';
import { CreateTaskRequest, UpdateTaskRequest } from '../Requests/TaskRequest';

export class TaskController {

    /**
     * GET /api/lists/:listId/tasks
     */
    public async index(req: Request, res: Response): Promise<any> {
        const listId = req.param('listId');
        const list = await BoardList.find(listId) as any;
        if (!list) return res.status(404).json({ message: 'List not found.' });

        const board = await list.board().get();
        const user = await req.auth.user();
        await Gate.forUser(user).authorize('view', board);

        const tasks = await Task.where('board_list_id', '=', listId)
            .orderBy('position', 'asc')
            .get();
        return res.json({ data: tasks });
    }

    /**
     * GET /api/tasks/:id
     */
    public async show(req: Request, res: Response): Promise<any> {
        const task = await Task.find(req.param('id')) as any;
        if (!task) return res.status(404).json({ message: 'Task not found.' });
        
        const list = await BoardList.find(task.board_list_id) as any;
        const board = await list.board().get();
        const user = await req.auth.user();
        await Gate.forUser(user).authorize('view', board);

        const assignees = await task.assignees().get();
        const attachments = await task.attachments().get();

        return res.json({ 
            data: {
                ...task.toJSON(),
                assignees,
                attachments
            }
        });
    }

    /**
     * POST /api/lists/:listId/tasks
     */
    public async store(req: CreateTaskRequest, res: Response): Promise<any> {
        const user = await req.auth.user();
        const listId = req.param('listId');
        const list = await BoardList.find(listId) as any;
        if (!list) return res.status(404).json({ message: 'List not found.' });

        const board = await list.board().get();
        await Gate.forUser(user).authorize('addContent', board);

        const data = req.validated();
        const count = await Task.where('board_list_id', '=', listId).count();

        const task = await Task.create({
            ...data,
            board_list_id: listId,
            position: count,
        });

        return res.status(201).json({ data: task });
    }

    /**
     * PUT /api/tasks/:id
     */
    public async update(req: UpdateTaskRequest, res: Response): Promise<any> {
        const user = await req.auth.user();
        const task = await Task.find(req.param('id')) as any;
        if (!task) return res.status(404).json({ message: 'Task not found.' });

        const list = await BoardList.find(task.board_list_id) as any;
        const board = await list.board().get();
        await Gate.forUser(user).authorize('addContent', board);

        const validatedData = req.validated();
        
        // Filter out undefined/null values before update to prevent DB constraint errors
        const data: Record<string, any> = {};
        for (const key in validatedData) {
            if (validatedData[key] !== undefined && validatedData[key] !== null) {
                data[key] = validatedData[key];
            }
        }
        
        const oldListId = task.board_list_id;
        
        await task.update(data);

        // --- EVENT: Task Completed ---
        if (data.board_list_id !== undefined && data.board_list_id !== oldListId) {
            const newList = await BoardList.find(data.board_list_id) as any;
            const listTitle = newList?.title?.toLowerCase();
            
            if (['done', 'completed', 'finished'].includes(listTitle)) {
                const { TaskCompletedEvent } = require('../../Events/TaskCompletedEvent');
                Event.dispatch(new TaskCompletedEvent(task.title, user.email, board.title));
            }
        }

        return res.json({ data: task });
    }

    /**
     * DELETE /api/tasks/:id
     */
    public async destroy(req: Request, res: Response): Promise<any> {
        const user = await req.auth.user();
        const task = await Task.find(req.param('id')) as any;
        if (!task) return res.status(404).json({ message: 'Task not found.' });

        const list = await BoardList.find(task.board_list_id) as any;
        const board = await list.board().get();
        await Gate.forUser(user).authorize('addContent', board);

        await task.delete();
        return res.status(204).json({ message: 'Task deleted.' });
    }

    /**
     * POST /api/tasks/:id/assign
     */
    public async assign(req: Request, res: Response): Promise<any> {
        const user = await req.auth.user();
        const task = await Task.find(req.param('id')) as any;
        if (!task) return res.status(404).json({ message: 'Task not found.' });

        const list = await BoardList.find(task.board_list_id) as any;
        const board = await list.board().get();
        await Gate.forUser(user).authorize('addContent', board);

        const { user_id } = req.all() as any;
        const existing = await TaskAssignee.where('task_id', '=', task.id)
            .where('user_id', '=', user_id)
            .first();

        if (existing) return res.status(409).json({ message: 'User already assigned.' });

        await TaskAssignee.create({ task_id: task.id, user_id });

        // Phase 5: Advanced Polish - Send Background Notification
        try {
            const assignee = await User.find(user_id) as any;
            if (assignee && board) {
                Queue.push(new SendAssigneeNotificationJob(assignee.email, task.title, board.title));
            }
        } catch (e) {}

        return res.status(201).json({ message: 'User assigned successfully.' });
    }

    /**
     * DELETE /api/tasks/:id/assign/:userId
     */
    public async unassign(req: Request, res: Response): Promise<any> {
        const user = await req.auth.user();
        const task = await Task.find(req.param('id')) as any;
        if (!task) return res.status(404).json({ message: 'Task not found.' });

        const list = await BoardList.find(task.board_list_id) as any;
        const board = await list.board().get();
        await Gate.forUser(user).authorize('addContent', board);

        const assignment = await TaskAssignee.where('task_id', '=', req.param('id'))
            .where('user_id', '=', req.param('userId'))
            .first();

        if (!assignment) return res.status(404).json({ message: 'Assignment not found.' });

        await assignment.delete();
        return res.status(204).json({ message: 'User unassigned.' });
    }
}
