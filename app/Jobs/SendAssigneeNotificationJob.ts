import { BaseJob } from '@arikajs/queue/src/Job';
import { Mail, config, Log } from 'arikajs';
import { TaskAssigned } from '../Mail/TaskAssigned';

export class SendAssigneeNotificationJob extends BaseJob {
    constructor(
        private email: string,
        private taskTitle: string,
        private boardTitle: string
    ) {
        super();
    }

    /**
     * Execute the job.
     */
    public async handle() {
        try {
            const appName = config('app.name', 'FlowBoard');
            await Mail.to(this.email).send(
                new TaskAssigned(this.taskTitle, this.boardTitle, appName)
            );
        } catch (e) {
            Log.error('Failed to send assignee notification email via Queue', {
                error: (e as Error).message,
                email: this.email
            });
            throw e; // Rethrow to trigger retries if configured
        }
    }
}
