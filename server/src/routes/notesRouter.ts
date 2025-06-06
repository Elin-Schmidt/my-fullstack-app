import express from 'express';
import {
    getUserNotes,
    createNote,
    updateNote,
    deleteNote
} from '../controllers/notesController';
import { RequestHandler } from 'express';

const router = express.Router();

router.get('/user/:userId', getUserNotes);

router.post('/', createNote);

router.put('/:id', updateNote as RequestHandler);

router.delete('/:id', deleteNote);

export default router;
