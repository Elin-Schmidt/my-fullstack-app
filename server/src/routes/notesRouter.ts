import express from 'express';
import {
    getUserNotes,
    createNote,
    updateNote,
    deleteNote
} from '../controllers/notesController';
import { RequestHandler } from 'express';

const router = express.Router();

// Hämta anteckningar för en användare
router.get('/user/:userId', getUserNotes);

// Skapa anteckning för en användare
router.post('/', createNote);

router.put('/:id', updateNote as RequestHandler);

// Ta bort anteckning
router.delete('/:id', deleteNote);

export default router;
