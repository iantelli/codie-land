import { signIn, useSession } from "next-auth/react";
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
      await trpc.post.getAll.useQuery().refetch();
      return;
    }
    await like.mutateAsync({ postId, userId });
    await trpc.post.getAll.useQuery().refetch();
  };

  if (isLoading)
    return (
      <div className="absolute right-1/2 bottom-1/2  translate-x-1/2 translate-y-1/2 transform ">
        <div className="h-64 w-64 animate-spin  rounded-full border-8 border-solid border-blue-400 border-t-transparent"></div>
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
