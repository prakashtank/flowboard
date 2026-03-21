import { Request, Response, Middleware } from 'arikajs';
import Busboy from 'busboy';

export class MultipartMiddleware implements Middleware {
    /**
     * Handle the incoming request and parse multipart data.
     */
    public async handle(req: Request, next: (req: Request) => Promise<Response>, res?: Response): Promise<Response> {
        const contentType = req.header('content-type') as string;

        if (contentType && contentType.includes('multipart/form-data')) {
            await this.parseMultipart(req);
        }

        return next(req);
    }

    /**
     * Parse multipart stream using Busboy.
     */
    private parseMultipart(req: Request): Promise<void> {
        return new Promise((resolve, reject) => {
            const busboy = Busboy({ headers: req.headers() as any });
            const fields: Record<string, any> = {};
            const files: Record<string, any> = {};

            busboy.on('field', (name, value) => {
                fields[name] = value;
            });

            busboy.on('file', (name, file, info) => {
                const chunks: Buffer[] = [];
                file.on('data', (chunk) => chunks.push(chunk));
                file.on('end', () => {
                    const buffer = Buffer.concat(chunks);
                    files[name] = {
                        buffer: buffer,
                        originalName: info.filename,
                        encoding: info.encoding,
                        mimetype: info.mimeType,
                        size: buffer.length
                    };
                });
            });

            busboy.on('finish', () => {
                // Attach parsed data to request
                (req as any)._multipartFields = fields;
                (req as any)._multipartFiles = files;

                // Add helper methods to Request instance
                (req as any).file = function(name: string) {
                    return this._multipartFiles?.[name] || null;
                };
                (req as any).files = function() {
                    return this._multipartFiles || {};
                };

                // Merge fields into request body
                const existingBody = req.body() || {};
                req.setBody({ ...existingBody, ...fields });

                resolve();
            });

            busboy.on('error', (err) => reject(err));

            req.getRaw().pipe(busboy);
        });
    }
}
