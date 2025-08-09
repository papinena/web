
import { Box } from "~/components/ui/box";
import { ImageGallery } from "~/components/image-gallery";
import { MarkdownEditor } from "~/components/markdown-editor";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { ButtonWithSpinner } from "~/components/button-with-spinner";
import { ErrorMessage } from "~/components/error-message";
import { useNewPostStore } from "~/stores/new-post";
import { useCreateNewPost } from "~/hooks/useCreateNewPost";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useAuth } from "~/hooks/useAuth";
import { useImageReadToken } from "~/hooks/useImageReadToken";
import { Image } from "~/components/ui/image";

function PostNetworks({ social }: { social?: string }) {
  if (!social) return null;
  const [ig, fb] = social.split(";");
  return (
    <Box className="flex-col">
      <Box className="flex items-center gap-1.5">
        <Image src="/instagram.svg" className="size-5" />
        <Text>{ig.split(":")[1]}</Text>
      </Box>
      <Box className="flex items-center gap-1.5">
        <Image src="/facebook.svg" className="size-5" />
        <Text>{fb.split(":")[1]}</Text>
      </Box>
    </Box>
  );
}

export default function NewPostPreview() {
  const navigate = useNavigate();
  const { post, files, clear } = useNewPostStore();
  const { authData } = useAuth();
  const { buildUrl } = useImageReadToken();

  const { mutation } = useCreateNewPost({
    onSuccess: (postId) => {
      clear();
      navigate(`/post/${postId}`);
    },
  });

  if (!post) {
    return <div>No post data found.</div>;
  }

  const media = files.map((file) => ({
    id: file.name,
    filename: URL.createObjectURL(file),
    type: "IMAGE" as const,
  }));

  const author = authData?.userType === "user" ? authData.user : authData?.employee;

  return (
    <Box className="p-3 flex-1 bg-white rounded-lg flex-col gap-4">
      <ImageGallery media={media} buildUrl={(filename) => filename} />
      {post.description && (
        <MarkdownEditor markdown={post.description} readOnly />
      )}
      import { PostAuthor } from "~/components/post-author";
// ...
      <Text className="font-bold">
        Se interessou? Entre em contato direto com o seu vizinho.
      </Text>
      <Box className="flex-col">
        <PostAuthor>
          <PostAuthor.Avatar author={author} />
          <Box className="flex-col">
            <PostAuthor.Name author={author} />
            <PostAuthor.Block author={author} />
          </Box>
        </PostAuthor>
        <PostNetworks social={post.social} />
        <Box className="flex items-center gap-1.5">
          <Image src="/wpp-icon.svg" className="size-5" />
          <Text>{author?.telephone}</Text>
        </Box>
      </Box>
// ...
      <Box className="flex gap-4">
        <Button onClick={() => navigate(-1)}>Voltar</Button>
        <ButtonWithSpinner loading={mutation.isPending} onClick={() => mutation.mutate({ form: post, files })}>
          Publicar
        </ButtonWithSpinner>
      </Box>
      <ErrorMessage show={mutation.isError}>
        {(mutation.error as Error)?.message}
      </ErrorMessage>
    </Box>
  );
}
