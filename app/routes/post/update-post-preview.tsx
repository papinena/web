import { Box } from "~/components/ui/box";
import { ImageGallery } from "~/components/image-gallery";
import { MarkdownEditor } from "~/components/markdown-editor";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useNavigate, useParams } from "react-router";
import { ButtonWithSpinner } from "~/components/button-with-spinner";
import { ErrorMessage } from "~/components/error-message";
import { useNewPostStore } from "~/stores/new-post";
import { usePost } from "~/hooks/usePost";
import { useAuth } from "~/hooks/useAuth";
import { Image } from "~/components/ui/image";
import { PostAuthor } from "~/components/post-author";
import { RouteContainer } from "~/components/route-container";
import { Post } from "~/components/post";

export default function UpdatePostPreview() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { updatedPosts, clear } = useNewPostStore();
  const { updatePostMutation } = usePost({
    onUpdateSuccess: () => {
      clear();
      navigate(`/post/${postId}`);
    },
  });
  const { authData } = useAuth();

  if (!postId) {
    return (
      <RouteContainer className="items-center justify-center">
        <Text>Post não encontrado.</Text>
      </RouteContainer>
    );
  }

  const post = updatedPosts[postId];
  const files = post?.files ?? [];

  if (!post) {
    return (
      <RouteContainer className="items-center justify-center">
        <Text>Informações não encontradas.</Text>
      </RouteContainer>
    );
  }

  const onPublish = () => {
    updatePostMutation.mutate({ postId, data: post });
  };

  const media =
    files.map((file) => ({
      id: file.name,
      filename: URL.createObjectURL(file),
      type: "IMAGE" as const,
    })) ?? [];

  const author =
    authData?.userType === "user" ? authData.user : authData?.employee;

  return (
    <RouteContainer>
      <Box className="p-3 flex-1 bg-white rounded-lg flex-col gap-4">
        <ImageGallery media={media} buildUrl={(filename) => filename} />
        {post.description && (
          <MarkdownEditor markdown={post.description} readOnly />
        )}
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
          <Post.Networks
            post={{ social: `${post.instagram};${post.facebook}` }}
          />
          {post.includeTelephone && (
            <Box className="flex items-center gap-1.5">
              <Image src="/wpp-icon.svg" className="size-5" />
              <Text>{author?.telephone}</Text>
            </Box>
          )}
        </Box>
        <Box className="flex gap-4">
          <Button onClick={() => navigate(-1)}>Voltar</Button>
          <ButtonWithSpinner
            loading={updatePostMutation.isPending}
            onClick={onPublish}
          >
            Atualizar
          </ButtonWithSpinner>
        </Box>
        <ErrorMessage show={updatePostMutation.isError}>
          {(updatePostMutation.error as Error)?.message}
        </ErrorMessage>
      </Box>
    </RouteContainer>
  );
}
