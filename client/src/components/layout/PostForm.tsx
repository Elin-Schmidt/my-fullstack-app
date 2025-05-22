import React, { useState } from 'react';
import styles from './PostForm.module.css';

function PostForm({ onAddPost }: { onAddPost: (content: string) => void }) {
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        onAddPost(content);
        setContent('');
    };

    return (
        <form className={styles.postForm} onSubmit={handleSubmit}>
            <textarea
                className={styles.postFormTextarea}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Skriv ditt inlägg här..."
                rows={5}
            />
            <button className={styles.postFormButton} type="submit">
                Skicka
            </button>
        </form>
    );
}

export default PostForm;
