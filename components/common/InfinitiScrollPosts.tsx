import React, { FC, ReactNode } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PostCard from "./PostCard";
import { PostDetails } from "utils/types";

interface InfiniteScrollPostsProps {
  posts: PostDetails[];
  hasMore: boolean;
  dataLength: number;
  showControls?: boolean;
  loader?: ReactNode;
  next(): void;
}

const InfiniteScrollPosts: FC<InfiniteScrollPostsProps> = ({
  posts,
  showControls,
  hasMore,
  dataLength,
  loader,
  next,
}) => {
  const defaultLoader = (
    <p className="p-3 text-secondary-dark text-xl text-center font-semibold animate-pulse opacity-50">
      Loading...
    </p>
  );
  return (
    <InfiniteScroll
      hasMore={hasMore}
      next={next}
      dataLength={dataLength}
      loader={loader || defaultLoader}
    >
      <div className="grid grid-cols-3 grid-rows-3 gap-4 p-1 min-h-screen">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} controls={showControls} />
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default InfiniteScrollPosts;
