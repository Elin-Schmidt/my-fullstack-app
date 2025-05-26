import express from 'express';
import {
    getAllUsers,
    getUserById,
    updateUser,
    uploadProfilePicture,
    uploadCoverImage
} from '../controllers/userController';
import { uploadProfile, uploadCover } from '../controllers/uploadConfig';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.post(
    '/:userId/upload-profile-picture',
    uploadProfile.single('profile_picture'),
    uploadProfilePicture
);
router.post(
    '/:userId/upload-cover-image',
    uploadCover.single('cover_image'),
    uploadCoverImage
);

export default router;
