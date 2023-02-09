import { stat } from 'fs/promises';

export async function checkFileExists(fileName: string): Promise<boolean> {
  try {
    await stat(fileName);
    return true;
  } catch (error) {
    return false;
  }
}
