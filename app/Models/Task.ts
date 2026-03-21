import { Model } from 'arikajs';
import { BoardList } from './BoardList';
import { User } from './User';
import { TaskAttachment } from './TaskAttachment';

export class Task extends Model {
    protected static table = 'tasks';

    /**
     * The attributes that are mass assignable.
     */
    protected fillable: string[] = [
        'board_list_id',
        'title',
        'description',
        'position',
        'due_date'
    ];

    /**
     * The attributes that should be cast.
     */
    protected casts: Record<string, any> = {
        position: 'integer',
        due_date: 'datetime'
    };

    /**
     * The list this task belongs to.
     */
    public list() {
        return this.belongsTo(BoardList, 'board_list_id');
    }

    /**
     * The users assigned to this task.
     */
    public assignees() {
        return this.belongsToMany(User, 'task_assignees', 'task_id', 'user_id');
    }

    /**
     * The attachments for this task.
     */
    public attachments() {
        return this.hasMany(TaskAttachment, 'task_id');
    }
}
