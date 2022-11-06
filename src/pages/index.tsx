import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import Button from "../components/Button";
import PostSmall from "../components/PostSmall";
import { useRouter } from "next/router";

const Posts = () => {
  const { data: posts, isLoading } = trpc.post.getAll.useQuery();
  const { data: session } = useSession();
  const like = trpc.like.likePost.useMutation();
  const router = useRouter();

  const handleLike = async (postId: number, userId: string) => {
    if (!session) {
      signIn();
      return;
    }
    await like.mutateAsync({ postId, userId });
  };

  if (isLoading) return <div>Fetching messages...</div>;

  return (
    <div>
      {posts?.map((post, index) => {
        return (
          <>
            <PostSmall
              key={index}
              post={post}
              onLike={handleLike}
              onComment={() => router.push(`/post/${post.id}`)}
              href={`/post/${post.id}`}
              user={post.User}
            />
          </>
        );
      })}
    </div>
  );
};

const Home = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <main className="flex flex-col items-center pt-4">Loading...</main>;
  }

  return (
    <main className="flex flex-col items-center">
      <h1 className="pt-4 text-3xl">CodieLand</h1>
      <p>
        Post your <code>code-snippets</code>
      </p>
      <div className="pt-10">
        <div>
          {session ? (
            <>
              <p>hi {session.user?.name}</p>
              <button onClick={() => signOut()}>Logout</button>
            </>
          ) : (
            <Button onClick={() => signIn("discord")} className="bg-blue-600">
              Login with Discord
            </Button>
          )}
          <Posts />
        </div>
      </div>
    </main>
  );
};
export default Home;
