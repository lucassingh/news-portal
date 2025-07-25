export interface News {
    id: number;
    title: string;
    subtitle: string;
    image_url: string | null;
    image_description: string;
    body: string;
    date: string;
}