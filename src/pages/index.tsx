import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import PostSmall from "../components/PostSmall";
import { trpc } from "../utils/trpc";

const Home = () => {
  const { data: posts, isLoading } = trpc.post.getAll.useQuery();
  const { data: session } = useSession();
  const router = useRouter();
  const like = trpc.like.likePost.useMutation();
  const unlike = trpc.like.unlikePost.useMutation();

  const handleLike = async (postId: number, userId: string) => {
    if (!session) {
      signIn();
      return;
    }

    if (
      posts!
        .find((post) => post.id === postId)
        ?.likes.find((like) => like.userId === userId)
    ) {
      await unlike.mutateAsync({ postId, userId });
      return;
    }
    await like.mutateAsync({ postId, userId });
  };

  if (isLoading)
    return (
      <div className="mt-6 flex items-center justify-center space-x-2">
        <div
          className="spinner-border inline-block h-12 w-12 animate-spin rounded-full border-4"
          role="status"
        >
          <span className="invisible">Loading...</span>
        </div>
      </div>
    );

  return (
    <>
      <div className="mx-auto max-w-7xl px-2 pt-8 pb-10 lg:pt-12 lg:pb-14">
        <div className="mx-auto max-w-2xl">
          {posts?.map((post, index) => {
            return (
              <>
                <PostSmall
                  key={index}
                  post={post}
                  onLike={() => handleLike(post.id, session!.user!.id)}
                  onComment={() => router.push(`/code/${post.id}`)}
                  href={`/code/${post.id}`}
                  user={post.User}
                />
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default Home;
