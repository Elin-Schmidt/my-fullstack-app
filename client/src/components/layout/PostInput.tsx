import React, { useState } from 'react';

function PostForm({ onAddPost }: { onAddPost: (content: string) => void }) {
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        onAddPost(content);
        setContent('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Skriv ditt inlägg här..."
            />
            <button type="submit">Skicka</button>
        </form>
    );
}

export default PostForm;
