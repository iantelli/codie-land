import Post from "../../components/Post";
import Comments from "../../components/Comments";
import { trpc } from "../../utils/trpc";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function Code() {
  const { data: session } = useSession();
  const router = useRouter();
  const postId = router.query.id as string;
  const id = parseInt(postId);
  const { data: post, isLoading } = trpc.post.findPost.useQuery({ id });
  const { data: comments, isLoading: commentsLoading } =
    trpc.comment.getAllFromPost.useQuery({ id });
  const like = trpc.like.likePost.useMutation();

  const handleLike = async (postId: number, userId: string) => {
    if (!session) {
      signIn();
      return;
    }
    await like.mutateAsync({ postId, userId });
  };

  if (!session) {
    return <div>Not authenticated</div>;
  }

  if (isLoading) return <div>Fetching posts...</div>;

  return (
    <>
      <Post
        className="mx-auto my-6 max-w-2xl px-6"
        post={post}
        onLike={handleLike}
        onComment={() => router.push(`/code/${post?.id}`)}
        user={post?.User}
        liked={false}
      />
      <div className="mx-auto my-6 max-w-2xl border-t border-gray-600">
        <Comments comments={comments} />
      </div>

      <div> </div>
    </>
  );
}
