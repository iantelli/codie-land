// /pages/profile.jsx
import { useSession, signIn, signOut } from "next-auth/react";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import Comments from "../components/Comments";
import PostSmall from "../components/PostSmall";
import Button from "../components/Button";
import Head from "next/head";

export default function Component() {
  const { data: session } = useSession();
  const { data: posts, isLoading: postsLoading } =
    trpc.post.findPostsByUserId.useQuery({
      id: session!.user!.id,
    });
  const { data: comments, isLoading: commentsLoading } =
    trpc.comment.findCommentsByUserId.useQuery({
      id: session!.user!.id,
    });
  const router = useRouter();
  const like = trpc.like.likePost.useMutation();
  const unlike = trpc.like.unlikePost.useMutation();

  const handleLike = async (postId: number, userId: string) => {
    if (!session) {
      signIn();
      return;
    }
    if (post.liked) {
      await like.mutateAsync({ postId, userId });
    }
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
                <div>Loading...</div>
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
              <div>Loading...</div>
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
