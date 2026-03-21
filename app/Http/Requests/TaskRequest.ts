import { FormRequest } from './FormRequest';

export class CreateTaskRequest extends FormRequest {
    public rules(): Record<string, string> {
        return {
            title: 'required|min:3',
            board_list_id: 'required',
            description: 'string',
            due_date: 'string', // ArikaJS validation doesn't have a 'date' rule yet
        };
    }

    public messages(): Record<string, string> {
        return {
            'title.required': 'The task title is required.',
            'title.min': 'Task title must be at least 3 characters.',
            'board_list_id.required': 'Task must belong to a list.',
        };
    }
}

export class UpdateTaskRequest extends FormRequest {
    public rules(): Record<string, string> {
        return {
            title: 'min:3', // Removing 'required' from update makes it optional and only validated if present
            description: 'string',
            position: 'number',
            board_list_id: 'string',
            due_date: 'string',
        };
    }
}
