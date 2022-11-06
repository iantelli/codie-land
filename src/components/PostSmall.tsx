import Link from "next/link";
import Image from "next/image";

import PostActions from "./PostActions";

import formatTimeAgo from "../utils/formatTimeAgo";
import highlight from "../utils/highlight";

export default function PostSmall({
  onLike,
  onComment,
  href,
  post,
  user,
  className = "",
}: {
  onLike: (postId: number, userId: string) => Promise<void>;
  onComment: () => void;
  href: string;
  post: any;
  user: any;
  className?: string;
}) {
  return (
    <div
      className={
        "lex flex-col overflow-hidden rounded-lg shadow-lg " + className
      }
    >
      <div className="flex flex-1 flex-col justify-between p-6 pb-3">
        <Link href={href}>
          <div className="mt-2 flex items-center">
            <div className="flex-shrink-0 text-gray-100">
              <Image
                className="h-12 w-12 rounded-full"
                src={user?.image}
                width={50}
                height={50}
                alt=""
              />
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-100">
                  {user?.name}
                </p>
                <p className="text-sm text-gray-300">
                  {formatTimeAgo(post.createdAt)}
                </p>
              </div>
              <div className="mt-1 flex-1"></div>
            </div>
          </div>
          <pre className="mx-5 mt-4 max-h-52 overflow-hidden whitespace-pre-wrap break-words border-b border-gray-700">
            <code
              className={post.language ? `language-${post.language}` : ""}
              dangerouslySetInnerHTML={{
                __html: highlight(post.code, post.language),
              }}
            ></code>
          </pre>
        </Link>
      </div>
      <div className="flex flex-col items-center pb-3">
        <PostActions
          onComment={onComment}
          onLike={onLike}
          liked={post.liked}
          totalComments={post.totalComments}
          totalLikes={post.totalLikes}
        />
      </div>
    </div>
  );
}
