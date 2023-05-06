import React, { FC, ReactNode, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PostCard from "./PostCard";
import { PostDetails } from "utils/types";
import ConformModal from "./ConformModal";
import axios from "axios";

interface InfiniteScrollPostsProps {
  posts: PostDetails[];
  hasMore: boolean;
  dataLength: number;
  showControls?: boolean;
  loader?: ReactNode;
  next(): void;
  onPostRefresh(postId: string): void;
}

const InfiniteScrollPosts: FC<InfiniteScrollPostsProps> = ({
  posts,
  showControls,
  hasMore,
  dataLength,
  loader,
  onPostRefresh,
  next,
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [postIdForDelete, setPostIdForDelete] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handelOnDeleteClick = (id: string) => {
    setShowConfirmDialog(true);
    setPostIdForDelete(id);
  }
  const handleDeletePost = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!postIdForDelete) {
        return setShowConfirmDialog(false);
      }
      const { data } = await axios.delete(`/api/posts/${postIdForDelete}`);
      if (data.removed) {
        setPostIdForDelete(null);
        setShowConfirmDialog(false);
        onPostRefresh(postIdForDelete)
      }
      console.log(data);

    } catch (error: any) {
      console.error(error.response.data);
      setError(error?.message || error || "Something went wrong")
    }
    setIsLoading(false)
  }
  const defaultLoader = (
    <p className="p-3 text-secondary-dark text-xl text-center font-semibold animate-pulse opacity-50">
      Loading...
    </p>
  );
  return (
    <>
      <InfiniteScroll
        hasMore={hasMore}
        next={next}
        dataLength={dataLength}
        loader={loader || defaultLoader}
      >
        <div className="grid grid-cols-3 grid-rows-3 gap-4 p-1 min-h-screen">
          {posts.map((post) => (
            <PostCard onDeleteClick={() => handelOnDeleteClick(post.id)} key={post.slug} post={post} controls={showControls} busy={isLoading && postIdForDelete === post.id} />
          ))}
        </div>
      </InfiniteScroll>
      <ConformModal
        isLoading={isLoading}
        visible={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onCancel={() => setShowConfirmDialog(false)}
        onConfirm={handleDeletePost}
        title="Delete post?"
        subtitle="The post will be completely deleted"
        error={error} />

    </>

  );
};

export default InfiniteScrollPosts;
