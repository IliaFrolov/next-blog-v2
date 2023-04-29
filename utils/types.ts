export interface PostDetails {
    id: string;
    title: string;
    slug: string;
    meta: string;
    content: string | null;
    tags: string[];
    thumbnail?: string | null;
    createdAt: string;
}

export interface UserProfile {
    id: string;
    email: string;
    name: string;
    avatar: string | undefined;
    role: "user" | "admin";
}