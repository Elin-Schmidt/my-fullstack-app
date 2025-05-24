import multer from 'multer';
import path from 'path';

export const uploadProfile = multer({
    storage: multer.diskStorage({
        destination: path.join(__dirname, '../../uploads/profilepic'),
        filename: (_req, file, cb) =>
            cb(null, Date.now() + '-' + file.originalname)
    })
});

export const uploadCover = multer({
    storage: multer.diskStorage({
        destination: path.join(__dirname, '../../uploads/coverpic'),
        filename: (_req, file, cb) =>
            cb(null, Date.now() + '-' + file.originalname)
    })
});
