import DefaultLayout from "@components/layout/DefaultLayout";
import parse from 'html-react-parser';
import dbConnect from "@lib/dbConnect";
import Post from "@models/Post";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import Image from "next/image";
import { formatPost } from "@lib/utils";
import { PostDetails } from "utils/types";
import dateFormat from "dateformat";
import cn from "classnames";

type SinglePostProps = InferGetStaticPropsType<typeof getStaticProps>;

const SinglePost: NextPage<SinglePostProps> = ({ post }) => {
    const { meta, title, content, tags, thumbnail, createdAt } = post;
    return <DefaultLayout title={title} desc={meta}>
        {thumbnail && <div className="relative aspect-video">
            <Image width={10000} height={10000} className="w-full" src={thumbnail} alt={title} />
        </div>}
        <h1 className="text-6xl font-bold text-primary-dark dark:text-primary">{title}</h1>
        <div className="flex items-center justify-between dark:text-secondary-light py-3 text-secondary-dark">
            <span>{tags.map((tag, idx) => (<span className="mr-2" key={idx + tag}>#{tags}</span>))}</span>
            <span>{dateFormat(createdAt, 'd-mmm-yyyy')}</span></div>
        <div className={cn("prose prose-lg max-w-full mx-auto dark:prose-invert")}>

            {content && parse(content)}
        </div>

    </DefaultLayout>;
};

export default SinglePost;

export const getStaticPaths: GetStaticPaths = async () => {
    try {
        await dbConnect();
        const posts = await Post.find().select('slug');
        const paths = posts.map(({ slug }) => ({ params: { slug } }));
        return {
            paths,
            fallback: 'blocking'
        }
    } catch (error) {
        return {
            paths: [{ params: { slug: '/' } }],
            fallback: false
        }
    }

}
interface StaticPropsResponse {
    post: PostDetails
}
export const getStaticProps: GetStaticProps<StaticPropsResponse, { slug: string }> = async ({ params }) => {
    try {
        await dbConnect();
        const post = await Post.findOne({ slug: params?.slug })
        if (!post) return { notFound: true }
        return {
            props: {
                post: formatPost(post)
            }
        }
    } catch (error) {
        return { notFound: true };
    }
};
