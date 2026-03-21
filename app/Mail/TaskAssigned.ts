import { Mailable } from 'arikajs';

export class TaskAssigned extends Mailable {
    constructor(
        private taskTitle: string,
        private boardTitle: string,
        private appName: string
    ) {
        super();
    }

    public build() {
        return this.subject(`New Task Assigned: ${this.taskTitle}`)
            .view('emails.tasks.assigned', {
                task_title: this.taskTitle,
                board_title: this.boardTitle,
                app_name: this.appName,
                year: new Date().getFullYear()
            });
    }
}
