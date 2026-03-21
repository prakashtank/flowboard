import { Request, Response, Validator } from 'arikajs';
import { Gate } from '@arikajs/authorization';
import { Board } from '@Models/Board';
import { BoardList } from '@Models/BoardList';

export class BoardListController {

    /**
     * GET /api/boards/:id/lists
     */
    public async index(req: Request, res: Response): Promise<any> {
        const user = await req.auth.user();
        const board = await Board.find(req.param('id')) as any;
        if (!board) return res.status(404).json({ message: 'Board not found.' });

        await Gate.forUser(user).authorize('view', board);

        const lists = await BoardList.where('board_id', '=', board.id)
            .orderBy('position', 'asc')
            .get();

        return res.json({ data: lists });
    }

    /**
     * POST /api/boards/:id/lists
     */
    public async store(req: Request, res: Response): Promise<any> {
        const user = await req.auth.user();
        const board = await Board.find(req.param('id')) as any;
        if (!board) return res.status(404).json({ message: 'Board not found.' });

        await Gate.forUser(user).authorize('addContent', board);

        const { title } = req.all();
        const validator = new Validator({ title }, { title: 'required|min:1' });
        
        if (await validator.fails()) {
            return res.status(422).json({ errors: validator.errors() });
        }

        const count = await BoardList.where('board_id', '=', board.id).count();

        const list = await BoardList.create({
            board_id: board.id,
            title,
            position: count,
        });

        return res.status(201).json({ data: list });
    }

    /**
     * PUT /api/boards/:id/lists/:listId
     */
    public async update(req: Request, res: Response): Promise<any> {
        const user = await req.auth.user();
        const board = await Board.find(req.param('id')) as any;
        if (!board) return res.status(404).json({ message: 'Board not found.' });

        await Gate.forUser(user).authorize('addContent', board);

        const list = await BoardList.find(req.param('listId')) as any;
        if (!list || list.board_id !== board.id) {
            return res.status(404).json({ message: 'List not found.' });
        }

        const { title, position } = req.all();
        const updateData: any = {};
        if (title !== undefined) updateData.title = title;
        if (position !== undefined) updateData.position = position;

        await list.update(updateData);

        return res.json({ data: list });
    }

    /**
     * DELETE /api/boards/:id/lists/:listId
     */
    public async destroy(req: Request, res: Response): Promise<any> {
        const user = await req.auth.user();
        const board = await Board.find(req.param('id')) as any;
        if (!board) return res.status(404).json({ message: 'Board not found.' });

        await Gate.forUser(user).authorize('addContent', board);

        const list = await BoardList.find(req.param('listId')) as any;
        if (!list || list.board_id !== board.id) {
            return res.status(404).json({ message: 'List not found.' });
        }

        await list.delete();
        return res.status(204).json({ message: 'List deleted.' });
    }
}
