import Post from "../../components/Post";
import Comments from "../../components/Comments";
import CommentForm from "../../components/CommentForm";
import { trpc } from "../../utils/trpc";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect } from "react";

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

  const handleLike = async (postId: number, userId: string) => {
    if (!session) {
      signIn();
      return;
    }
    await like.mutateAsync({ postId, userId });
  };

  const handleSubmitComment = async (content: string) => {
    await commentContent.mutateAsync({
      content,
      postId: id,
      userId: session!.user!.id,
    });
    router.reload();
  };

  if (isLoading && commentsLoading) return <div>Fetching posts...</div>;

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/styles/hybrid.min.css"
        />
        <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/highlight.min.js"></script>
      </Head>
      <Post
        className="mx-auto my-6 max-w-2xl px-6"
        post={post}
        onLike={handleLike}
        onComment={() => router.push(`/code/${post?.id}`)}
        user={post?.User}
        liked={false}
      />
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
