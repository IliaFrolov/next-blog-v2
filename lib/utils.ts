import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "./dbConnect";
import Post, { PostModelSchema, PostModelSchemaWithId } from "@models/Post";
import { PostDetails, UserProfile } from "utils/types";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

interface FormidablePromise<T> {
  files: formidable.Files;
  body: T;
}

export const readFile = <T extends object>(req: NextApiRequest): Promise<FormidablePromise<T>> => {
  const form = formidable();
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);

      resolve({ files, body: fields as T });
    });
  });
};


export const readPostFromDb = async (limit: number, pageNo: number, skip?: number) => {
  if (!limit || limit > 10) throw Error('Please use limits under 10 and valid')
  const finalSkip = skip || limit * pageNo
  await dbConnect();
  return await Post.find()
    .sort({ createdAt: 'desc' })
    .select('-content')
    .skip(finalSkip)
    .limit(limit)
}

export const formatPost = ({ _id, content, title, slug, thumbnail, createdAt, tags, meta }: PostModelSchemaWithId, short?: boolean): PostDetails => ({
  id: _id.toString(),
  thumbnail: thumbnail?.url || null,
  createdAt: createdAt.toString(),
  title,
  slug,
  content: short ? null : content,
  tags,
  meta,
})


export const formatPosts = (posts: PostModelSchemaWithId[]): PostDetails[] => {
  return posts.map((post) => formatPost(post, true))

};

export const isAdmin = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  const user = session?.user as UserProfile;
  return user?.role === 'admin';
}

export const checkAuthorization = async (req: NextApiRequest, res: NextApiResponse) => {
  const admin = await isAdmin(req, res)
  if (!admin) return res.status(401).json({ error: "Unauthorized request!" });
}