import React, { useState } from "react";
import InfiniteScrollPosts from "@components/common/InfiniteScrollPosts";
import DefaultLayout from "@components/layout/DefaultLayout";
import type {
  NextPage,
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next";
import { PostDetails, UserProfile } from "utils/types";
import { formatPosts, readPostFromDb } from "@lib/utils";
import axios from "axios";
import { useSession } from "next-auth/react";
import { filterPostsById } from "utils/helper";

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

let pageNo = 0;
const limit = 7;
const Home: NextPage<Props> = ({ posts }) => {
  const [postToRender, setPostsToRender] = useState(posts);
  const [hasMorePosts, setHasMorePosts] = useState(posts.length >= limit);

  const { data } = useSession()
  const profile = data?.user as UserProfile
  const isAdmin = profile?.role === "admin"

  const fetchMorePosts = async () => {
    try {
      pageNo++;
      const { data } = await axios.get(
        `/api/posts?limit=${limit}&skip=${postToRender.length}`
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
    <DefaultLayout className="pb-20">
      <InfiniteScrollPosts
        posts={postToRender}
        dataLength={postToRender.length}
        hasMore={hasMorePosts}
        next={fetchMorePosts}
        showControls={isAdmin}
        onPostRefresh={(postId) => {
          setPostsToRender(filterPostsById(postToRender, postId))
        }}
      />
    </DefaultLayout>
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
export default Home;
