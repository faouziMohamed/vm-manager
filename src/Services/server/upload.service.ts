import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';
import { NextApiRequest } from 'next';
import process from 'process';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadImage(img: formidable.File, folder: string) {
  const { filepath, newFilename } = img; // remove extension from filename if exists

  const publicId = newFilename.replace(/\.[^/.]+$/, '');
  const uploaded = await cloudinary.uploader.upload(filepath, {
    public_id: `${folder}/${publicId}`,
    folder,
    overwrite: true,
  });
  const { secure_url: url, public_id: cloudId } = uploaded;
  return { url, cloudId };
}

export async function uploadUserAvatar(img: formidable.File) {
  return uploadImage(img, 'avatar');
}

const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];

export function handleUploadedFile(
  req: NextApiRequest,
  userId: string,
  callback: (file: formidable.File | null, error: string | null) => void,
) {
  const form = formidable({
    multiples: false,
    keepExtensions: true,
    filename(name, extension, part) {
      if (!part.mimetype || !allowedMimeTypes.includes(part.mimetype)) {
        throw new Error('Invalid file type');
      }
      return `u_${userId}_avatar`;
    },
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      callback(null, err as string);
      return;
    }
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    callback(file, null);
  });
  return form;
}
