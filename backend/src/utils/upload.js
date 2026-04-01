import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../uploads');

export const uploadImageBuffer = async (buffer, folder = 'products') => {
  const folderPath = path.join(uploadsDir, folder);
  
  // Ensure upload directory exists
  try {
    await fs.mkdir(folderPath, { recursive: true });
  } catch (error) {
    throw new Error(`Failed to create upload directory: ${error.message}`);
  }

  // Generate unique filename
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const filename = `${timestamp}-${random}.jpg`;
  const filePath = path.join(folderPath, filename);

  try {
    await fs.writeFile(filePath, buffer);
    const url = `/uploads/${folder}/${filename}`;
    return { url, publicId: filename };
  } catch (error) {
    throw new Error(`Failed to save file: ${error.message}`);
  }
};
