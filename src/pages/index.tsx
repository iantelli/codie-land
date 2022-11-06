import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import Button from "../components/Button";
import PostSmall from "../components/PostSmall";
import { useRouter } from "next/router";
import NavBar from "../components/NavBar";

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
  const router = useRouter();

  if (status === "loading") {
    return <main className="flex flex-col items-center pt-4">Loading...</main>;
  }

  return (
    <div className="mx-auto max-w-7xl px-2 pt-8 pb-10 lg:pt-12 lg:pb-14">
      <div className="mx-auto max-w-2xl">
        {/* <div className="pt-10">
          <div>
            {session ? (
              <>
                <p>hi {session.user?.name}</p>
                <button onClick={() => signOut()}>Logout</button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => signIn("discord")}
                  className="bg-blue-600"
                >
                  Login with Discord
                </Button>
                <Button
                  onClick={() => signIn("github")}
                  className="bg-gray-800"
                >
                  Login with Github
                </Button>
              </>
            )} */}
        <Posts />
      </div>
    </div>
  );
};
export default Home;
