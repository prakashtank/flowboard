import { Request, Response, Cache } from 'arikajs';
import { Gate } from '@arikajs/authorization';
import { Board } from '@Models/Board';
import { BoardRequest } from '../Requests/BoardRequest';

export class BoardController {

    /**
     * GET /api/boards
     * List all boards for the authenticated user.
     */
    public async index(req: Request, res: Response): Promise<any> {
        const user = await req.auth.user();
        if (!user) {
            return res.status(401).json({ message: 'Unauthenticated.' });
        }

        // Only active boards by default (Soft deletes handled automatically)
        const boards = await Board.where('user_id', '=', (user as any).id).get();

        return res.json({ data: boards });
    }

    /**
     * POST /api/boards
     * Create a new board.
     */
    public async store(req: BoardRequest, res: Response): Promise<any> {
        const user = await req.auth.user();
        if (!user) {
            return res.status(401).json({ message: 'Unauthenticated.' });
        }

        const data = req.validated();

        const board = await Board.create({
            ...data,
            user_id: (user as any).id,
        });

        return res.status(201).json({ data: board });
    }

    /**
     * GET /api/boards/:id
     * Show a single board with its lists and tasks.
     */
    public async show(req: Request, res: Response): Promise<any> {
        const user = await req.auth.user();
        const boardId = req.param('id');
        const cacheKey = `board:${boardId}:user:${(user as any).id}`;

        const board = await Cache.remember(cacheKey, 600, async () => {
            return await Board.find(boardId);
        }) as Board | null;

        if (!board) {
            return res.status(404).json({ message: 'Board not found.' });
        }

        // --- AUTHORIZATION POLICY ---
        if (await Gate.forUser(user).denies('view', board)) {
            return res.status(403).json({ message: 'Unauthorized access to this board.' });
        }

        return res.json({ data: board });
    }

    /**
     * PUT /api/boards/:id
     * Update a board.
     */
    public async update(req: BoardRequest, res: Response): Promise<any> {
        const user = await req.auth.user();
        const boardId = req.param('id');
        const board = await Board.find(boardId) as Board | null;

        if (!board) {
            return res.status(404).json({ message: 'Board not found.' });
        }

        // --- AUTHORIZATION POLICY ---
        await Gate.forUser(user).authorize('update', board);

        const validatedData = req.validated();

        // Filter to only included fields to allow partial updates without collisions
        const data: Record<string, any> = {};
        for (const key in validatedData) {
            if (validatedData[key] !== undefined && validatedData[key] !== null) {
                data[key] = validatedData[key];
            }
        }

        await board.update(data);

        // Invalidate cache
        await Cache.forget(`board:${boardId}:user:${(user as any).id}`);

        return res.json({ data: board });
    }

    /**
     * POST /api/boards/:id/archive
     * Archive a board (soft-delete style for cleanup task).
     */
    public async archive(req: Request, res: Response): Promise<any> {
        const user = await req.auth.user();
        const board = await Board.find(req.param('id')) as Board | null;

        if (!board) {
            return res.status(404).json({ message: 'Board not found.' });
        }

        await Gate.forUser(user).authorize('update', board);

        await board.delete();
        await Cache.forget(`board:${(board as any).id}:user:${(user as any).id}`);

        return res.json({ message: 'Board archived successfully.' });
    }

    /**
     * DELETE /api/boards/:id
     * Permanent delete a board.
     */
    public async destroy(req: Request, res: Response): Promise<any> {
        const user = await req.auth.user();
        const boardId = req.param('id');
        const board = await Board.find(boardId) as Board | null;

        if (!board) {
            return res.status(404).json({ message: 'Board not found.' });
        }

        // --- AUTHORIZATION POLICY ---
        await Gate.forUser(user).authorize('delete', board);

        await board.forceDelete();

        // Invalidate cache
        await Cache.forget(`board:${boardId}:user:${(user as any).id}`);

        return res.status(204).json({ message: 'Board deleted permanently.' });
    }
}
