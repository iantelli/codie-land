import Image from "next/image";

import PostActions from "./PostActions";

import formatTimeAgo from "../utils/formatTimeAgo";
import highlight from "../utils/highlight";

import { twMerge } from "tailwind-merge";

export default function Post({
  onComment,
  onLike,
  liked,
  post,
  user,
  smallMaxWith,
  largeMaxWidth,
  className = "",
}: {
  onComment: () => void;
  onLike: (postId: number, userId: string) => Promise<void>;
  liked: boolean;
  post: any;
  user: any;
  smallMaxWith?: string;
  largeMaxWidth?: string;
  className?: string;
}) {
  return (
    <>
      <div
        className={twMerge("m-auto flex items-center", smallMaxWith, className)}
      >
        <div className="min-w-2xl flex-shrink-0">
          <span className="sr-only">{post.author?.name}</span>
          <Image
            className="h-12 w-12 rounded-full"
            src={user.image}
            width={50}
            height={50}
            alt=""
          />
        </div>
        <div className="ml-4 flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-100">{user.name}</p>
            <p className="pl-5 text-sm text-gray-300">
              {formatTimeAgo(post.createdAt)}
            </p>
          </div>
          <div className="mt-1 flex-1">
            <p className="text-xl font-semibold text-gray-100">Title</p>
          </div>
        </div>
      </div>

      <div
        className={twMerge(
          "margin-auto flex flex-col items-center",
          largeMaxWidth
        )}
      >
        <div className={"flex flex-col justify-between"}>
          <pre className="mx-5 mt-5 whitespace-pre-wrap break-words">
            <code
              className={post.language ? `language-${post.language}` : ""}
              dangerouslySetInnerHTML={{
                __html: highlight(post.code, post.language),
              }}
            ></code>
          </pre>
        </div>
        <PostActions
          className="mt-6 mb-3"
          onComment={onComment}
          onLike={onLike}
          liked={liked}
          totalComments={post.totalComments}
          totalLikes={post.totalLikes}
        />
      </div>
    </>
  );
}
