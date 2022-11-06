import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { FormEventHandler, useState, useContext } from "react";
import NewPostForm from "../components/NewPostForm";
import Head from "next/head";

export default function CreatePost() {
  const { data: session } = useSession();
  const router = useRouter();
  const postMessage = trpc.post.postMessage.useMutation();

  const handleSubmit = async (code: string, language: string) => {
    await postMessage.mutateAsync({ code, language });
    router.push("/");
  };

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <Head>
        <title>Create a new post</title>
      </Head>
      <h1 className="pt-4 text-3xl">Create a new post</h1>
      <NewPostForm onSubmit={handleSubmit} />
    </div>
  );
}
