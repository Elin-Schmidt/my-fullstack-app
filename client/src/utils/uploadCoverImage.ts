// src/utils/uploadCoverImage.ts
import axios from 'axios';
import { API_BASE_URL } from './api.ts'; // Din API bas URL

export async function uploadCoverImage(file: File, userId: string) {
    const formData = new FormData();
    formData.append('cover_image', file);

    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/users/${userId}/upload-cover-image`,
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
