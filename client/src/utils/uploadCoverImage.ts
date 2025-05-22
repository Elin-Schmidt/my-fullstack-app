// src/utils/uploadCoverImage.ts
import axios from 'axios';

export async function uploadCoverImage(file: File, userId: string) {
    const formData = new FormData();
    formData.append('cover_image', file);

    try {
        const response = await axios.post(
            `/api/users/${userId}/upload-cover-image`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data; // här ligger JSON-svaret
    } catch (error) {
        console.error(error);
        throw new Error('Misslyckades med att ladda upp omslagsbild');
    }
}
