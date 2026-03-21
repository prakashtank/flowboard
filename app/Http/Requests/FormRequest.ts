import { Request, Validator } from 'arikajs';

export abstract class FormRequest {
    protected request: Request;

    constructor(request: Request) {
        this.request = request;
    }

    /**
     * Define the validation rules.
     */
    abstract rules(): Record<string, any>;

    /**
     * Define custom error messages.
     */
    public messages(): Record<string, string> {
        return {};
    }

    /**
     * Validate the request data.
     */
    public async validate(): Promise<Record<string, any>> {
        const validator = new Validator(
            this.request.all(),
            this.rules(),
            this.messages()
        );

        if (await validator.fails()) {
            // Throw an error that can be caught by the exception handler
            // or return errors to the controller.
            // For now, let's throw a structured error.
            const error = new Error('Validation failed');
            (error as any).status = 422;
            (error as any).errors = validator.errors();
            throw error;
        }

        return validator.validated();
    }
}
