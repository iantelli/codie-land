import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import NewPostForm from "../components/NewPostForm";

export default function CreatePost() {
  const { data: session } = useSession();
  const router = useRouter();
  const postMessage = trpc.post.postCode.useMutation();

  const handleSubmit = async (code: string, language: string) => {
    await postMessage.mutateAsync({ code, language });
    router.push("/");
  };

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return (
    <>
      <div className="mx-auto my-6 max-w-5xl px-6 pt-8 pb-10 lg:pt-12 lg:pb-14">
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl md:text-6xl">
          Create a Snippet
        </h1>

        <div className="mt-6">
          <NewPostForm className="max-w-5xl" onSubmit={handleSubmit} />
        </div>
      </div>
    </>
  );
}
