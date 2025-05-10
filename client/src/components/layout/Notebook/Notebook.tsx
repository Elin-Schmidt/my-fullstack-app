import { useState, useCallback } from 'react';
import styles from './Notebook.module.css';

const Notebook: React.FC = () => {
    const [diaryEntry, setDiaryEntry] = useState<string>('');
    const [diaryEntries, setDiaryEntries] = useState<string[]>([]);
    const [editIndex, setEditIndex] = useState<number | null>(null);

    const addOrUpdateEntry = useCallback(() => {
        if (diaryEntry.trim()) {
            const updatedEntries =
                editIndex !== null
                    ? [
                          ...diaryEntries.slice(0, editIndex),
                          diaryEntry,
                          ...diaryEntries.slice(editIndex + 1)
                      ]
                    : [...diaryEntries, diaryEntry];

            setDiaryEntries(updatedEntries);
            setDiaryEntry('');
            setEditIndex(null);
        }
    }, [diaryEntry, diaryEntries, editIndex]);

    const deleteEntry = useCallback(
        (index: number): void => {
            setDiaryEntries(diaryEntries.filter((_, i) => i !== index));
        },
        [diaryEntries]
    );

    const startEditing = useCallback(
        (index: number): void => {
            setDiaryEntry(diaryEntries[index]);
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
            <ul>
                {diaryEntries.length > 0 ? (
                    diaryEntries.map((entry, index) => (
                        <li key={index} className={styles.entryContainer}>
                            <p className={styles.entry}>{entry}</p>
                            <button
                                className={styles.actionText}
                                onClick={() => startEditing(index)}
                            >
                                Redigera
                            </button>
                            <button
                                className={styles.actionText}
                                onClick={() => deleteEntry(index)}
                            >
                                Radera
                            </button>
                        </li>
                    ))
                ) : (
                    <p className={styles.emptyMessage}>
                        Inga anteckningar ännu!
                    </p>
                )}
            </ul>
        </div>
    );
};

export default Notebook;
