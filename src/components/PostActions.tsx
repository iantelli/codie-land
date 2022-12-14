import {
  ChatBubbleBottomCenterTextIcon as CommentIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";

export default function PostActions({
  onComment,
  onLike,
  totalLikes,
  totalComments,
  liked,
  className = "",
  disabled,
}: {
  onComment: () => void;
  onLike: () => void;
  totalLikes: number;
  totalComments: number;
  liked: boolean;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <div className={"flex items-center justify-between " + className}>
      <button
        onClick={onComment}
        className="flex flex-col items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-500 hover:outline-none"
      >
        <span>{totalComments}</span>
        <CommentIcon className="h-7 w-7" aria-hidden="true" />
      </button>
      <button
        onClick={() => onLike()}
        disabled={disabled}
        className="flex flex-col items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-500 hover:outline-none"
      >
        <span>{totalLikes}</span>
        {liked ? (
          <HeartIconSolid className="h-7 w-7" aria-hidden="true" />
        ) : (
          <HeartIcon className="h-7 w-7" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
