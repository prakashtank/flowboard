import { Request, Response } from 'arikajs';
import { Storage } from '@arikajs/storage';
import { Task } from '@Models/Task';
import { TaskAttachment } from '@Models/TaskAttachment';

export class TaskAttachmentController {
    /**
     * POST /api/tasks/:id/attachments
     * Upload an attachment for a task using the Storage system.
     */
    public async store(req: Request, res: Response): Promise<any> {
        const task = await Task.find(req.param('id'));
        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        const file = (req as any).file('attachment');
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        const fileName = file.originalName;
        const storagePath = `attachments/task_${(task as any).id}_${Date.now()}_${fileName}`;
        
        // --- USING ARIKAJS STORAGE SYSTEM ---
        // Storage.disk('public').put(path, contents)
        // Note: some drivers might accept a file path or buffer.
        // Usually ArikaJS .put() accepts the buffer or string.
        await Storage.disk('public').put(storagePath, file.buffer || file.stream);

        const attachment = await TaskAttachment.create({
            task_id: (task as any).id,
            name: fileName,
            path: storagePath,
            size: file.size.toString()
        });

        return res.status(201).json({ data: attachment });
    }

    /**
     * DELETE /api/attachments/:id
     * Delete an attachment using the Storage system.
     */
    public async destroy(req: Request, res: Response): Promise<any> {
        const attachment = await TaskAttachment.find(req.param('id'));
        if (!attachment) {
            return res.status(404).json({ message: 'Attachment not found.' });
        }

        // --- USING ARIKAJS STORAGE SYSTEM ---
        await Storage.disk('public').delete((attachment as any).path);

        await attachment.delete();
        return res.status(204).json({ message: 'Attachment deleted.' });
    }
}
