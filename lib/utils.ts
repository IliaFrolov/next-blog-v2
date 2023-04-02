import formidable from "formidable";
import { NextApiRequest } from "next";
import dbConnect from "./dbConnect";
import Post, { PostModelSchema } from "@models/Post";
import { PostDetails } from "utils/types";

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


export const readPostFromDb = async (limit: number, pageNo: number) => {
  if (!limit || limit > 10) throw Error('Please use limits under 10 and valid')
  const skip = limit * pageNo
  await dbConnect();
  return await Post.find()
    .sort({ createdAt: 'desc' })
    .select('-content')
    .skip(skip)
    .limit(limit)
}

export const formatPosts = (posts: PostModelSchema[]): PostDetails[] => {
  return posts.map(({ title, slug, thumbnail, createdAt, tags, meta }) => ({
    thumbnail: thumbnail?.url || null,
    createdAt: createdAt.toString(),
    title,
    slug,
    tags,
    meta,
  }))

};