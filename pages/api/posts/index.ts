import { NextApiHandler } from 'next';
import dbConnect from '@lib/dbConnect';
import { postValidationSchema, validateSchema } from '@lib/validator';
import { checkAuthorization, formatPosts, isAdmin, readFile, readPostFromDb } from '@lib/utils';
import Post from '@models/Post';
import formidable from 'formidable';
import cloudinary from '@lib/cloudinary';
import { FinalPost } from '@components/editor';
import { getServerSession } from 'next-auth';
import { options } from 'joi';
import { authOptions } from '../auth/[...nextauth]';
import { UserProfile } from 'utils/types';

export const config = {
    api: { bodyParser: false },
};

const handler: NextApiHandler = (req, res) => {
    const { method } = req;

    switch (method) {
        case 'GET':
            return getPosts(req, res);
        case 'POST':
            return createPost(req, res);
        default:
            return res.status(404).send('Not found!');
    }
};

const createPost: NextApiHandler = async (req, res) => {
    await checkAuthorization(req, res);

    const { files, body } = await readFile<FinalPost>(req);

    let tags = []
    if (body.tags) tags = JSON.parse(body.tags as string)

    const error = validateSchema(postValidationSchema, { ...body, tags })

    if (error) {
        res.status(400).json({ error })
    }
    const { title, content, slug, meta } = body
    await dbConnect()
    const alreadyExists = await Post.findOne({ slug });
    if (alreadyExists) {
        return res.status(400).json({ error: 'Slug needs to be unique' })
    }
    const newPost = new Post({ title, content, slug, meta, tags })

    const thumbnail = files?.thumbnail as formidable.File;
    if (thumbnail) {
        const { secure_url: url, public_id } = await cloudinary.uploader.upload(thumbnail.filepath, {
            folder: process.env.CLOUD_FOLDER_NAME,
        })
        newPost.thumbnail = { url, public_id }
    }
    await newPost.save();

    res.json({ post: newPost })

};

const getPosts: NextApiHandler = async (req, res) => {
    const { limit, pageNo, skip } = req.query as { limit: string, pageNo: string, skip: string }
    try {
        const posts = await readPostFromDb(
            parseInt(limit),
            parseInt(pageNo),
            parseInt(skip)
        )
        res.json({ posts: formatPosts(posts) });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};


export default handler;