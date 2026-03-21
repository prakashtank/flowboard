import { Mailable } from 'arikajs';

/**
 * Mailable for notifying the owner about task completion.
 */
export class TaskCompletedMail extends Mailable {
    /**
     * Create a new message instance.
     */
    constructor(
        private taskTitle: string,
        private boardTitle: string
    ) {
        super();
    }

    /**
     * Build the message.
     */
    public build() {
        return this.subject(`Great job! Task "${this.taskTitle}" is finished.`)
            .view('emails.task_completed', {
                taskTitle: this.taskTitle,
                boardTitle: this.boardTitle
            });
    }
}
