// /pages/profile.jsx
import { unstable_getServerSession } from "next-auth/next";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import Button from "../components/Button";
import Comments from "../components/Comments";
import PostSmall from "../components/PostSmall";
import { trpc } from "../utils/trpc";
import { authOptions } from "./api/auth/[...nextauth]";

export default function Component() {
  const { data: session } = useSession();
  const router = useRouter();

  const { data: posts, isLoading: postsLoading } =
    trpc.post.findPostsByUserId.useQuery({
      id: session!.user!.id,
    });
  const { data: comments, isLoading: commentsLoading } =
    trpc.comment.findCommentsByUserId.useQuery({
      id: session!.user!.id,
    });

  const like = trpc.like.likePost.useMutation();
  const unlike = trpc.like.unlikePost.useMutation();

  const [disabled, setDisabled] = useState(false);

  const handleLike = async (postId: number, userId: string) => {
    if (!session) {
      signIn();
      return;
    }

    if (disabled) return;

    if (
      posts!
        .find((post) => post.id === postId)
        ?.likes.find((like) => like.userId === userId)
    ) {
      setDisabled(true);
      await unlike.mutateAsync({ postId, userId });
      setDisabled(false);
      router.reload();
      return;
    }
    setDisabled(true);
    await like.mutateAsync({ postId, userId });
    setDisabled(false);
    router.reload();
  };

  if (session) {
    return (
      <>
        <div className="mx-auto max-w-7xl px-2 pt-8 pb-10 lg:pt-12 lg:pb-14">
          <div className="mx-auto max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-100">
              {session?.user?.name}
            </h1>
            <img
              width={100}
              height={100}
              src={session?.user?.image || undefined}
              alt={session?.user?.name || undefined}
            />
            <h2>{session?.user?.name}</h2>
            <p>{session?.user?.email}</p>
            <Button className="my-4 bg-red-600" onClick={() => signOut()}>
              Sign out
            </Button>
            <hr />
            <h1 className="my-8 text-3xl font-bold text-gray-100">
              {" "}
              Your Posts
            </h1>
            {posts?.map((post, index) =>
              postsLoading ? (
                <div className="mt-6 flex items-center justify-center space-x-2">
                  <div
                    className="spinner-border inline-block h-12 w-12 animate-spin rounded-full border-4"
                    role="status"
                  >
                    <span className="invisible">Loading...</span>
                  </div>
                </div>
              ) : (
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
              )
            )}
            <hr />
            <h1 className="my-8 text-3xl font-bold text-gray-100">
              {" "}
              Your Comments
            </h1>
            {commentsLoading ? (
              <div className="mt-6 flex items-center justify-center space-x-2">
                <div
                  className="spinner-border inline-block h-12 w-12 animate-spin rounded-full border-4"
                  role="status"
                >
                  <span className="invisible">Loading...</span>
                </div>
              </div>
            ) : (
              <Comments comments={comments} />
            )}
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    //redirect to login page
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
