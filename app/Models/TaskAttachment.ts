import { Model } from 'arikajs';

export class TaskAttachment extends Model {
    protected static table = 'task_attachments';

    protected fillable: string[] = [
        'task_id',
        'name',
        'path',
        'size'
    ];
}
