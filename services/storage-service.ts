import { createWriteStream } from "fs";
import path from "path";
import { finished } from "stream/promises";
import * as dotenv from 'dotenv';

dotenv.config();

class StorageService {
    public async saveFile(stream: NodeJS.ReadableStream, fileId: string): Promise<string> {
        const storageProvider = process.env.STORAGE_PROVIDER || 'local';

        if (storageProvider === 'local') {
            return this.saveLocally(stream, fileId);
        } else if (storageProvider === 'gcs') {
            // In the future, you would add your GCS storage logic here
            // For now, we'll just throw an error
            throw new Error("GCS storage provider is not yet implemented.");
        } else {
            throw new Error(`Invalid STORAGE_PROVIDER specified: ${storageProvider}`);
        }
    }

    private async saveLocally(stream: NodeJS.ReadableStream, fileId: string): Promise<string> {
        const uploadDir = process.env.LOCAL_UPLOAD_DIR || 'uploads';
        const filePath = path.join(uploadDir, fileId);

        const out = createWriteStream(filePath);
        stream.pipe(out);
        await finished(out);

        return filePath;
    }
}

export default new StorageService();
