import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from './Notebook.module.css';
import { API_BASE_URL } from '@/utils/api.ts';
import { useAuthContext } from '@/context/LoginHandler.tsx';

type Note = {
    id: number;
    user_id: number;
    content: string;
    created_at: string;
};

const Notebook: React.FC = () => {
    const { user } = useAuthContext();
    const [diaryEntry, setDiaryEntry] = useState<string>('');
    const [diaryEntries, setDiaryEntries] = useState<Note[]>([]);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);

    useEffect(() => {
        if (!user) return;
        axios.get(`${API_BASE_URL}/api/notes/user/${user.id}`).then((res) => {
            setDiaryEntries(res.data);
            if (res.data.length > 0) setSelectedNoteId(res.data[0].id);
        });
    }, [user]);

    const addOrUpdateEntry = useCallback(async () => {
        if (!user) return;
        if (diaryEntry.trim()) {
            if (editIndex !== null) {
                const note = diaryEntries[editIndex];
                const res = await axios.put(
                    `${API_BASE_URL}/api/notes/${note.id}`,
                    { content: diaryEntry }
                );
                const updated = [...diaryEntries];
                updated[editIndex] = res.data;
                setDiaryEntries(updated);
            } else {
                const res = await axios.post(`${API_BASE_URL}/api/notes`, {
                    user_id: user.id,
                    content: diaryEntry
                });
                setDiaryEntries([res.data, ...diaryEntries]);
            }
            setDiaryEntry('');
            setEditIndex(null);
        }
    }, [diaryEntry, diaryEntries, editIndex, user]);

    const deleteEntry = useCallback(
        async (index: number): Promise<void> => {
            const note = diaryEntries[index];
            await axios.delete(`${API_BASE_URL}/api/notes/${note.id}`);
            setDiaryEntries(diaryEntries.filter((_, i) => i !== index));
        },
        [diaryEntries]
    );

    const startEditing = useCallback(
        (index: number): void => {
            setDiaryEntry(diaryEntries[index].content);
            setEditIndex(index);
        },
        [diaryEntries]
    );

    return (
        <div className={styles.notebook}>
            <h1 className={styles.title}>Min Dagbok</h1>
            <textarea
                className={styles.textArea}
                placeholder="Skriv din anteckning här..."
                value={diaryEntry}
                onChange={(e) => setDiaryEntry(e.target.value)}
                rows={5}
            />
            <button className={styles.button} onClick={addOrUpdateEntry}>
                {editIndex !== null
                    ? 'Uppdatera anteckning'
                    : 'Lägg till anteckning'}
            </button>
            <hr />
            <div className={styles.notebookGrid}>
                <nav className={styles.quickNavColumn}>
                    {diaryEntries.map((entry) => (
                        <button
                            key={entry.id}
                            type="button"
                            className={styles.quickNavLink}
                            onClick={() => setSelectedNoteId(entry.id)}
                        >
                            {entry.content.slice(0, 20) || '...'}
                        </button>
                    ))}
                </nav>
                <div className={styles.notesContent}>
                    {selectedNoteId ? (
                        (() => {
                            const entry = diaryEntries.find(
                                (e) => e.id === selectedNoteId
                            );
                            return entry ? (
                                <div
                                    className={styles.entryContainer}
                                    id={`note-${entry.id}`}
                                >
                                    <p className={styles.entry}>
                                        {entry.content}
                                    </p>

                                    <div className={styles.actions}>
                                        <button
                                            className={styles.actionText}
                                            onClick={() =>
                                                startEditing(
                                                    diaryEntries.findIndex(
                                                        (e) => e.id === entry.id
                                                    )
                                                )
                                            }
                                        >
                                            Redigera
                                        </button>
                                        <button
                                            className={styles.actionText}
                                            onClick={() =>
                                                deleteEntry(
                                                    diaryEntries.findIndex(
                                                        (e) => e.id === entry.id
                                                    )
                                                )
                                            }
                                        >
                                            Radera
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className={styles.emptyMessage}>
                                    Anteckning hittades inte!
                                </p>
                            );
                        })()
                    ) : (
                        <p className={styles.emptyMessage}>
                            Välj en anteckning i listan!
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notebook;
