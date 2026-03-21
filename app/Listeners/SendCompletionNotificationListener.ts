import { Mail, Log } from 'arikajs';
import { TaskCompletedEvent } from '../Events/TaskCompletedEvent';
import { TaskCompletedMail } from '../Mail/TaskCompleted';

/**
 * Listener that hears TaskCompletedEvent and sends a congratulatory email.
 */
export class SendCompletionNotificationListener {
    /**
     * Handle the event.
     */
    public async handle(event: TaskCompletedEvent): Promise<void> {
        Log.info(`Handling TaskCompletedEvent for task: ${event.taskTitle} on board: ${event.boardTitle}`);

        try {
            await Mail.to(event.ownerEmail).send(new TaskCompletedMail(
                event.taskTitle,
                event.boardTitle
            ));
        } catch (e: any) {
            Log.error(`Failed to send task completion email: ${e.message}`);
        }
    }
}
