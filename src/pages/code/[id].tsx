import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import CommentForm from "../../components/CommentForm";
import Comments from "../../components/Comments";
import Post from "../../components/Post";
import { trpc } from "../../utils/trpc";

export default function Code() {
  const { data: session } = useSession();
  const router = useRouter();
  const postId = router.query.id as string;
  const id = parseInt(postId);
  const { data: post, isLoading } = trpc.post.findPost.useQuery({ id });
  const { data: comments, isLoading: commentsLoading } =
    trpc.comment.getAllFromPost.useQuery({ id });
  const commentContent = trpc.comment.createComment.useMutation();
  const like = trpc.like.likePost.useMutation();
  const unlike = trpc.like.unlikePost.useMutation();

  const handleLike = async (postId: number, userId: string) => {
    if (!session) {
      signIn();
      return;
    }

    if (post!.likes.find((like) => like.userId === userId)) {
      await unlike.mutateAsync({ postId, userId });
      trpc.post.findPost.useQuery({ id }).refetch();
      return;
    }
    await like.mutateAsync({ postId, userId });
    trpc.post.findPost.useQuery({ id }).refetch();
  };

  const handleSubmitComment = async (content: string) => {
    await commentContent.mutateAsync({
      content,
      postId: id,
      userId: session!.user!.id,
    });
    trpc.comment.getAllFromPost.useQuery({ id });
  };

  if (isLoading && commentsLoading)
    return (
      <div className="absolute right-1/2 bottom-1/2  translate-x-1/2 translate-y-1/2 transform ">
        <div className="h-64 w-64 animate-spin  rounded-full border-8 border-solid border-blue-400 border-t-transparent"></div>
      </div>
    );

  return (
    <>
      <div className="mx-auto max-w-7xl px-2 pt-8 pb-10 lg:pt-12 lg:pb-14">
        <div className="mx-auto max-w-2xl rounded-lg bg-gray-800 pt-2">
          <Post
            className="mx-auto my-6 max-w-2xl px-6"
            post={post}
            onLike={() => handleLike(post!.id, session!.user!.id)}
            onComment={() => router.push(`/code/${post?.id}`)}
            user={post?.User}
            liked={false}
          />
        </div>
      </div>
      <div className="mx-auto my-6 max-w-2xl border-t border-gray-600">
        {session ? (
          <CommentForm onSubmit={handleSubmitComment} user={session.user} />
        ) : (
          <div className="mx-auto"> Must be signed in to Comment</div>
        )}
        <Comments comments={comments} />
      </div>
    </>
  );
}
