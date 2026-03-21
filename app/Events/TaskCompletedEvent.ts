import { Event } from 'arikajs';

/**
 * Event fired when a task is moved to the "Done" list.
 */
export class TaskCompletedEvent extends Event {
    /**
     * Create a new event instance.
     * 
     * @param taskTitle The name of the completed task.
     * @param ownerEmail The email of the board owner.
     * @param boardTitle The name of the project.
     */
    constructor(
        public taskTitle: string,
        public ownerEmail: string,
        public boardTitle: string
    ) {
        super();
    }
}
