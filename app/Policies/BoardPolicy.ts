import { User } from '@Models/User';
import { Board } from '@Models/Board';

export class BoardPolicy {
    /**
     * Determine whether the user can view the board.
     */
    public view(user: User, board: Board): boolean {
        return (user as any).id == (board as any).user_id;
    }

    /**
     * Determine whether the user can update the board.
     */
    public update(user: User, board: Board): boolean {
        return (user as any).id == (board as any).user_id;
    }

    /**
     * Determine whether the user can delete the board.
     */
    public delete(user: User, board: Board): boolean {
        return (user as any).id == (board as any).user_id;
    }

    /**
     * Determine whether the user can add lists/tasks to the board.
     */
    public addContent(user: User, board: Board): boolean {
        // For now, only owner, but later we could add board members
        return (user as any).id == (board as any).user_id;
    }
}
