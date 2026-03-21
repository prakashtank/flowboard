import { ServiceProvider, Event } from 'arikajs';
import { TaskCompletedEvent } from '../Events/TaskCompletedEvent';
import { SendCompletionNotificationListener } from '../Listeners/SendCompletionNotificationListener';

export class EventServiceProvider extends ServiceProvider {
    /**
     * The event to listener mappings for the application.
     */
    protected listen = {
        [TaskCompletedEvent.name]: [
            SendCompletionNotificationListener,
        ],
    };

    /**
     * Register any application services.
     */
    public register(): void {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public boot(): void {
        // Register events using the static Event facade
        for (const [eventName, listeners] of Object.entries(this.listen)) {
            for (const listener of listeners) {
                Event.listen(eventName, listener);
            }
        }
    }
}
