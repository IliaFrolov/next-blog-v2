import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useState } from "react";
import AdminLayout from "@components/layout/AdminLayout";
import { PostDetails } from "utils/types";
import { formatPosts, readPostFromDb } from "@lib/utils";
import InfiniteScrollPosts from "@components/common/InfinitiScrollPosts";
import axios from "axios";

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

let pageNo = 0;
const limit = 9;

const Posts: NextPage<Props> = ({ posts }) => {
  const [postToRender, setPostsToRender] = useState(posts);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  const fetchMorePosts = async () => {
    try {
      pageNo++;
      const { data } = await axios.get(
        `/api/posts?limit=${limit}&pageNo=${pageNo}`
      );
      setPostsToRender([...postToRender, ...data.posts]);
      if (data.posts.length < limit) {
        setHasMorePosts(false);
      }
    } catch (error) {
      setHasMorePosts(false);
      console.error(error);
    }
  };
  return (
    <AdminLayout className="p-3">
      <InfiniteScrollPosts
        posts={postToRender}
        dataLength={postToRender.length}
        hasMore={hasMorePosts}
        next={fetchMorePosts}
        showControls
      />
    </AdminLayout>
  );
};
interface ServerSideResponse {
  posts: PostDetails[];
}
export const getServerSideProps: GetServerSideProps<
  ServerSideResponse
> = async () => {
  try {
    const posts = await readPostFromDb(limit, pageNo);
    return { props: { posts: formatPosts(posts) } };
  } catch (error) {
    console.log(error);

    return { notFound: true };
  }
};

export default Posts;
