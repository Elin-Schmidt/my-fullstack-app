import axios from 'axios';
import { API_BASE_URL } from './api.ts'; // Din API bas URL

export async function uploadProfilePicture(file: File, userId: string) {
    const formData = new FormData();
    formData.append('profile_picture', file);

    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/users/${userId}/upload-profile-picture`,
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
        throw new Error('Misslyckades med att ladda upp profilbild');
    }
}
