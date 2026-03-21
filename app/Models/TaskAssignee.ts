import { Model } from 'arikajs';
import { Task } from './Task';
import { User } from './User';

export class TaskAssignee extends Model {
    protected static table = 'task_assignees';

    /**
     * The attributes that are mass assignable.
     */
    protected fillable: string[] = [
        'task_id',
        'user_id'
    ];

    /**
     * The task.
     */
    public task() {
        return this.belongsTo(Task, 'task_id');
    }

    /**
     * The assigned user.
     */
    public user() {
        return this.belongsTo(User, 'user_id');
    }
}
