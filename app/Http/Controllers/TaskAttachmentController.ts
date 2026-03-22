import { Request, Response, Storage } from 'arikajs';
import { Task } from '@Models/Task';
import { TaskAttachment } from '@Models/TaskAttachment';

export class TaskAttachmentController {
    /**
     * POST /api/tasks/:id/attachments
     * Upload an attachment for a task using the Storage system.
     */
    public async store(req: Request, res: Response): Promise<any> {
        const task = await Task.find(req.param('id')) as any;
        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        const file = req.file('attachment');
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        const fileName = file.getClientOriginalName();
        // Unique name to avoid collisions
        const uniqueName = `task_${task.id}_${Date.now()}_${fileName}`;
        
        // --- USING ARIKAJS STORAGE SYSTEM VIA UPLOADED FILE ---
        const storagePath = await file.store('attachments', { 
            disk: 'public', 
            name: uniqueName 
        });

        const attachment = await TaskAttachment.create({
            task_id: task.id,
            name: fileName,
            path: storagePath,
            size: '0' // Size could be fetched from disk if needed
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
