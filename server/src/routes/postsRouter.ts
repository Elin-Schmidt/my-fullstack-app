import {
    getUserPosts,
    createPost,
    likePost
} from '../controllers/postsController';
import { getComments, createComment } from '../controllers/commentsController';
import express from 'express';
const router = express.Router();
router.get('/user/:userId', getUserPosts);
router.post('/', createPost);
router.patch('/:id/like', likePost);
router.get('/:postId/comments', getComments);
router.post('/:postId/comments', createComment);

router.get('/', (req, res) => {
    res.send('Posts root works!');
});

export default router;
