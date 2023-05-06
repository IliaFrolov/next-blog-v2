import { NextPage } from "next";
import Editor, { FinalPost } from "@components/editor";
import AdminLayout from "@components/layout/AdminLayout";
import axios from "axios";
import { generateFormData } from "utils/helper";
import { useRouter } from "next/router";

interface Props { }

const Create: NextPage<Props> = () => {
  const router = useRouter()
  const handleSubmit = async (post: FinalPost) => {
    try {
      const { data } = await axios.post("/api/posts", generateFormData(post));
      if (data) router.push(`/admin/posts/update/${data.post.slug}`)
    } catch (error: any) {
      console.error(error.response.data);
    }
  };
  return (
    <AdminLayout title="New Post">
      <Editor onSubmit={handleSubmit} />
    </AdminLayout>
  );
};

export default Create;
