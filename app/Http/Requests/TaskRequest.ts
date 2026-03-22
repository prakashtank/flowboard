import { FormRequest } from 'arikajs';

export class CreateTaskRequest extends FormRequest {
    public rules(): Record<string, string> {
        return {
            title: 'required|min:3',
            board_list_id: 'required',
            description: 'string',
            due_date: 'string', 
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
            title: 'min:3',
            description: 'string',
            position: 'number',
            board_list_id: 'string',
            due_date: 'string',
        };
    }
}
