import { NextPage } from "next";
import Editor, { FinalPost } from "@components/editor";
import AdminLayout from "@components/layout/AdminLayout";
import axios from "axios";
import { generateFormData } from "utils/helper";

interface Props {}

const Create: NextPage<Props> = () => {
  const handleSubmit = async (post: FinalPost) => {
    try {
      const { data } = await axios.post("/api/posts", generateFormData(post));
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
