import { FinalPost } from '@components/editor';
import cloudinary from '@lib/cloudinary';
import dbConnect from '@lib/dbConnect';
import { checkAuthorization, readFile } from '@lib/utils';
import { postValidationSchema, validateSchema } from '@lib/validator';
import Post from '@models/Post';
import formidable from 'formidable';
import { NextApiHandler } from 'next';

export const config = {
    api: { bodyParser: false },
};

const handler: NextApiHandler = (req, res) => {
    const { method } = req;

    switch (method) {
        case 'GET':
            return getPost(req, res);
        case 'PATCH':
            return updatePost(req, res);
        case 'DELETE':
            return deletePost(req, res);
        default:
            return res.status(404).send('Not found!');
    }
};

const getPost: NextApiHandler = async (req, res) => {
    try {
        const postId = req.query.postId as string;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: "Post not found!" })
        res.json({ post: post })
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

const updatePost: NextApiHandler = async (req, res) => {
    try {
        await checkAuthorization(req, res);

        const postId = req.query.postId as string;
        await dbConnect()
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' })
        }
        const { files, body } = await readFile<FinalPost>(req)

        let tags = []
        if (body.tags) tags = JSON.parse(body.tags as string)

        const error = validateSchema(postValidationSchema, { ...body, tags });
        if (error) return res.status(400).json({ error });

        const { title, content, meta, slug } = body;

        post.title = title;
        post.content = content;
        post.meta = meta;
        post.tags = tags;
        post.slug = slug

        const thumbnail = files.thumbnail as formidable.File;
        if (thumbnail) {
            const { secure_url: url, public_id, ...rest } = await cloudinary.uploader.upload(thumbnail.filepath, {
                folder: process.env.CLOUD_FOLDER_NAME,
            });
            console.log({ rest });

            const publicId = post.thumbnail?.public_id;
            if (publicId) {
                await cloudinary.uploader.destroy(publicId)
            }

            post.thumbnail = { url, public_id }
        }
        const updatedPost = await post.save()

        res.json({ post: updatedPost });
    } catch (error: any) {
        console.error({ error });

        res.status(500).json({ error: error });
    }
};

const deletePost: NextApiHandler = async (req, res) => {
    try {
        await checkAuthorization(req, res);

        const postId = req.query.postId as string;
        const post = await Post.findByIdAndDelete(postId);
        if (!post) return res.status(404).json({ error: "Post not found!" })
        const publicId = post.thumbnail?.public_id;
        if (publicId) {
            await cloudinary.uploader.destroy(publicId);
        }
        res.json({ removed: true })

    } catch (error: any) {
        res.status(500).json({ error: error?.message });
    }
};

export default handler;