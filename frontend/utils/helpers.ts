import DOMPurify from 'dompurify';

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

export const sanitizeHTML = (html: string): string => {
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
            'p', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'strong', 'em', 'u', 's', 'blockquote', 'ol', 'ul', 'li',
            'a', 'img', 'span', 'div',
        ],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'style', 'class', 'target'],
    });
};