import { NextApiHandler } from 'next';
import dbConnect from '@lib/dbConnect';
import { postValidationSchema, validateSchema } from '@lib/validator';
import { formatPosts, readFile, readPostFromDb } from '@lib/utils';
import Post from '@models/Post';
import formidable from 'formidable';
import cloudinary from '@lib/cloudinary';
import { FinalPost } from '@components/editor';

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
        case 'PATCH':
            return updatePost(req, res);
        case 'DELETE':
            return deletePost(req, res);
        default:
            return res.status(404).send('Not found!');
    }
};

const createPost: NextApiHandler = async (req, res) => {

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
    const { limit, pageNo } = req.query as { limit: string, pageNo: string }
    try {
        const posts = await readPostFromDb(parseInt(limit), parseInt(pageNo))
        res.json({ posts: formatPosts(posts) });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

const updatePost: NextApiHandler = async (req, res) => {
    try {
        await dbConnect()
        res.json({ status: 200 });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

const deletePost: NextApiHandler = async (req, res) => {
    try {

        res.json({ status: 200 });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export default handler;