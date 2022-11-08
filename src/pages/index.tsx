import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import PostSmall from "../components/PostSmall";
import { useRouter } from "next/router";
import Head from "next/head";

const Posts = () => {
  const { data: posts, isLoading } = trpc.post.getAll.useQuery();
  const { data: session } = useSession();
  const router = useRouter();
  const like = trpc.like.likePost.useMutation();

  const handleLike = async (id: number) => {
    if (!session) {
      signIn();
      return;
    }
    await like.mutateAsync({ postId: id, userId: session!.user!.id });
  };

  if (isLoading) return <div>Fetching posts...</div>;

  return (
    <div>
      {posts?.map((post, index) => {
        return (
          <>
            <PostSmall
              key={index}
              post={post}
              onLike={handleLike}
              onComment={() => router.push(`/code/${post.id}`)}
              href={`/code/${post.id}`}
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
    <>
      <Head>
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/styles/hybrid.min.css"
        />
        <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/highlight.min.js"></script>
      </Head>
      <div className="mx-auto max-w-7xl px-2 pt-8 pb-10 lg:pt-12 lg:pb-14">
        <div className="mx-auto max-w-2xl">
          <Posts />
        </div>
      </div>
    </>
  );
};
export default Home;
