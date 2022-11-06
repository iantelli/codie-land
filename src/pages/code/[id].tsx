import Post from "../../components/Post";
import PostSmall from "../../components/PostSmall";
import { trpc } from "../../utils/trpc";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function Code() {
  const { data: session } = useSession();
  const router = useRouter();
  const postId = router.query.id as string;
  const id = parseInt(postId);
  console.log(id);
  const { data: post, isLoading } = trpc.post.findPost.useQuery({ id });
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
    <div className="mx-auto my-6 max-w-5xl px-6 pt-8 pb-10 lg:pt-12 lg:pb-14">
      <Post
        post={post}
        onLike={handleLike}
        onComment={() => router.push(`/code/${post?.id}`)}
        user={post?.User}
        liked={false}
      />
    </div>
  );
}
