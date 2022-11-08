import { useState } from "react";
import Image from "next/image";
import Button from "./Button";
export default function CommentForm({
  onSubmit,
  user,
  className = "",
  textareaRef,
}: {
  onSubmit: (content: string) => void;
  user: any;
  className?: string;
  textareaRef?: any;
}) {
  const [content, setContent] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit(content);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={"space-y-6" + className}
      action="#"
      method="POST"
    >
      <input type="hidden" name="remember" value="true" />
      <div className="-space-y-px rounded-md shadow-sm">
        <div className="flex items-start justify-items-stretch">
          <div className="flex-shrink-0 text-gray-400">
            <Image
              className="h-12 w-12 rounded-full"
              src={user.image}
              width={50}
              height={50}
              alt=""
            />
          </div>
          <div className="ml-5 flex-1">
            <label htmlFor="comment" className="sr-only">
              Comment
            </label>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              id="comment"
              name="comment"
              autoComplete="comment"
              required
              className="bg-dark relative block h-20 w-full appearance-none rounded-md rounded-b-md border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="Comment"
            />
            <Button className="my-4 bg-green-900">Add Comment</Button>
          </div>
        </div>
      </div>
    </form>
  );
}
