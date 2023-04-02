import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { FinalPost } from "@components/editor";
import dbConnect from "@lib/dbConnect";
import Post from "@models/Post";
import AdminLayout from "@components/layout/AdminLayout";
import Editor from "@components/editor/Editor";
import axios from "axios";
import { generateFormData } from "utils/helper";
import { useRouter } from "next/router";

interface PostResponse extends FinalPost {
  id: string;
}

type UpdatePostProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const UpdatePost: NextPage<UpdatePostProps> = ({ post }) => {
  const router = useRouter();
  const handleSubmit = async (post: FinalPost) => {
    try {
      const { data } = await axios.patch(
        `/api/posts/${post.id}`,
        generateFormData(post)
      );
      router.push(`/admin/posts/update/${data.post.slug}`, undefined, {
        shallow: true,
      });
    } catch (error: any) {
      console.error(error.response.data);
    }
  };
  return (
    <AdminLayout title="Update post">
      <Editor initialValue={post} onSubmit={handleSubmit} btnTitle="Update" />
    </AdminLayout>
  );
};

interface ServerSideResponse {
  post: PostResponse;
}

export const getServerSideProps: GetServerSideProps<
  ServerSideResponse
> = async (context) => {
  try {
    const slug = context.query.slug as string;
    await dbConnect();
    const post = await Post.findOne({ slug });
    if (!post) return { notFound: true };

    const { _id, title, content, thumbnail, tags, meta } = post;

    return {
      props: {
        post: {
          id: _id.toString(),
          title,
          content,
          tags: tags.join(", "),
          thumbnail: thumbnail?.url || null,
          slug,
          meta,
        },
      },
    };
  } catch (error) {
    return { notFound: true };
  }
};
export default UpdatePost;
