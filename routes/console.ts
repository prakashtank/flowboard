import { Schedule } from 'arikajs';

// Delete archived boards older than 30 days every night at midnight
// Run manually anytime: node arika.js boards:prune --days=30
Schedule.command('boards:prune').dailyAt('00:00');
