import axios from 'axios';
import { API_BASE_URL } from './api.ts';

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
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Misslyckades med att ladda upp omslagsbild');
    }
}
