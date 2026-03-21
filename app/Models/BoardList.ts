import { Model } from 'arikajs';
import { Board } from './Board';
import { Task } from './Task';

export class BoardList extends Model {
    protected static table = 'board_lists';

    /**
     * The attributes that are mass assignable.
     */
    protected fillable: string[] = [
        'board_id',
        'title',
        'position'
    ];

    /**
     * The attributes that should be cast.
     */
    protected casts: Record<string, any> = {
        position: 'integer'
    };

    /**
     * The board that this list belongs to.
     */
    public board() {
        return this.belongsTo(Board, 'board_id');
    }

    /**
     * The tasks in this list.
     */
    public tasks() {
        return this.hasMany(Task, 'board_list_id');
    }
}
