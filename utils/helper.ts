import { FinalPost } from "@components/editor";
import { PostDetails } from "./types";

export const generateFormData = (post: FinalPost) => {
    const formData = new FormData();
    for (let key in post) {
        const value = (post as any)[key];
        if (key === "tags" && value.trim()) {
            const tags = value.split(",").map((tag: string) => tag.trim());
            formData.append("tags", JSON.stringify(tags));
        } else formData.append(key, value);
    }
    return formData
}

export const filterPostsById = (posts: PostDetails[], postToFilter: string) => {
    return posts.filter((p) => p.id !== postToFilter);
}