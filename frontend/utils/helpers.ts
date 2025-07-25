export const buildImageUrl = (imagePath: string | undefined | null): string => {
    if (!imagePath?.trim()) return '';

    try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;

        if (!baseUrl) {
            console.error('VITE_API_BASE_URL no está definida en las variables de entorno');
            return '';
        }

        if (/^(https?:|data:)/i.test(imagePath)) {
            return imagePath;
        }

        const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

        return `${normalizedBase}${normalizedPath}`;
    } catch (error) {
        console.error('Error construyendo la URL de la imagen:', error);
        return '';
    }
};