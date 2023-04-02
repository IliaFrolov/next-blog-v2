export interface PostDetails {
    title: string;
    slug: string;
    meta: string;
    content?: string;
    tags: string[];
    thumbnail?: string | null;
    createdAt: string;
}