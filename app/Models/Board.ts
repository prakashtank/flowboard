import { Model } from 'arikajs';
import { User } from './User';
import { BoardList } from './BoardList';

export class Board extends Model {
    protected static table = 'boards';

    /**
     * The attributes that are mass assignable.
     */
    protected fillable: string[] = [
        'title',
        'description',
        'color',
        'user_id'
    ];

    /**
     * The owner of the board.
     */
    public owner() {
        return this.belongsTo(User, 'user_id');
    }

    /**
     * The lists belonging to the board.
     */
    public lists() {
        return this.hasMany(BoardList, 'board_id');
    }
}
