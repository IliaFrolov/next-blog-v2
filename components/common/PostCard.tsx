import Image from "next/image";
import React, { FC } from "react";
import { PostDetails } from "utils/types";
import dateformat from "dateformat";
import Button from "./Button";
import Link from "next/link";

interface PostCardProps {
  post: PostDetails;
  busy?: boolean;
  controls?: boolean;
  onDeleteClick?(): void;
}

const trimText = (text: string, trimBy: number) => {
  if (text.length <= trimBy) return text;
  return text.substring(0, trimBy).trim() + "...";
};

const PostCard: FC<PostCardProps> = ({
  post,
  busy,
  controls = false,
  onDeleteClick,
}) => {
  const { title, thumbnail, slug, tags, createdAt, meta } = post;
  return (
    <section
      aria-labelledby={`${slug}-title`}
      className="rounded shadow-sm hover:shadow-black shadow-secondary-dark overflow-hidden bg-primary dark:bg-primary-dark flex flex-col h-full transition"
    >
      <Link href={`/${slug}`}>
        <div className="aspect-video relative">
          {!thumbnail ? (
            <div className="w-full h-full flex justify-center items-center text-secondary-dark opacity-50 font-semibold">
              No image
            </div>
          ) : (
            <Image alt="cover" src={thumbnail} fill />
          )}
        </div>
        <div className="p-2 flex-1 flex-col">
          <div className="flex flex-center justify-between text-sm text-primary-dark dark:text-primary opacity-80">
            <div className="flex items-center space-x-1">
              {tags.map((t, idx) => (
                <span key={t + idx}>#{t}</span>
              ))}
            </div>
            <span>{dateformat(createdAt, "d-mmm-yyyy")}</span>
          </div>
          <h2
            className="text-lg font-bold text-primary-dark dark:text-primary"
            id={`${slug}-title`}
          >
            {trimText(title, 30)}
          </h2>
          <p className="text-secondary-dark font-semibold">
            {trimText(meta, 50)}
          </p>
        </div>
      </Link>
      {controls && (
        <div className="justify-end items-center h-8 mt-auto flex gap-2 font-semibold text-secondary-dark  dark:text-secondary-light p-2">
          {busy ? (
            <span className="animate-pulse">Removing...</span>
          ) : (
            <>
              <Button href={`/admin/posts/update/${slug}`}>Edit</Button>
              <Button onClick={onDeleteClick}>Delete</Button>
            </>
          )}
        </div>
      )}
    </section>
  );
};

export default PostCard;
