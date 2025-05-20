// src/utils/uploadCoverImage.ts
export async function uploadCoverImage(file: File, userId: string) {
    const formData = new FormData();
    formData.append('cover_image', file);

    const response = await fetch(`/api/users/${userId}/upload-cover-image`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Misslyckades med att ladda upp omslagsbild');
    }

    return await response.json();
}
