export async function uploadProfilePicture(file: File, userId: string) {
    const formData = new FormData();
    formData.append('profile_picture', file);

    const response = await fetch(
        `/api/users/${userId}/upload-profile-picture`,
        {
            method: 'POST',
            body: formData
        }
    );

    if (!response.ok) {
        throw new Error('Misslyckades med att ladda upp profilbild');
    }

    return await response.json();
}
