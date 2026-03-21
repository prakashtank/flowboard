import { FormRequest } from './FormRequest';

export class BoardRequest extends FormRequest {
    public rules(): Record<string, string> {
        return {
            title: 'required|min:3',
            description: 'string',
            color: 'string',
        };
    }

    public messages(): Record<string, string> {
        return {
            'title.required': 'A board title is required.',
            'title.min': 'The board title must be at least 3 characters long.',
        };
    }
}
