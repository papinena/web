import { Box } from "~/components/ui/box";
import "@mdxeditor/editor/style.css";
import { ImageGallery } from "~/components/image-gallery";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useNavigate } from "react-router";
import { ButtonWithSpinner } from "~/components/button-with-spinner";
import { ErrorMessage } from "~/components/error-message";
import { useAdminNewPostStore } from "~/stores/admin-new-post";
import { useAdminPost } from "~/hooks/useAdminPost";
import { RouteContainer } from "~/components/route-container";
import type { Route } from "../+types";

export default function UpdateAdminPostPreview({
  params,
}: Route.ComponentProps) {
  const navigate = useNavigate();
  const { postId } = params;
  const { updatedPosts, clearUpdatedPost } = useAdminNewPostStore();

  const post = updatedPosts[postId];
  const files = post?.photos;

  const { updateAdminPostMutation, resetQueries } = useAdminPost();

  if (!post) {
    return (
      <RouteContainer className="items-center justify-center">
        <Text>Informações não encontradas.</Text>
      </RouteContainer>
    );
  }

  const onPublish = () => {
    updateAdminPostMutation.mutate(
      { postId, data: post },
      {
        onSuccess: (postId) => {
          clearUpdatedPost(postId);
          resetQueries(["image-read-token", "post-images", postId]);
          navigate(`/post/admin/${postId}`);
        },
      }
    );
  };

  const media =
    files?.map((file) => ({
      id: file.name,
      filename: URL.createObjectURL(file),
      type: "IMAGE" as const,
    })) ?? [];

  return (
    <RouteContainer>
      <Box className="p-3 flex-1 bg-white rounded-lg flex-col gap-4">
        <ImageGallery media={media} buildUrl={(filename) => filename} />
        <Text className="text-bold text-green-primary">{post.title}</Text>
        <Text>{post.resume}</Text>
        <Box className="flex gap-10 w-full">
          <Button
            className="bg-green-primary flex-1 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            Editar
          </Button>
          <ButtonWithSpinner
            className="mx-0 hover:bg-black/90 flex-1 bg-green-primary"
            loading={updateAdminPostMutation.isPending}
            onClick={onPublish}
          >
            Publicar
          </ButtonWithSpinner>
        </Box>
        <ErrorMessage show={updateAdminPostMutation.isError}>
          {(updateAdminPostMutation.error as Error)?.message}
        </ErrorMessage>
      </Box>
    </RouteContainer>
  );
}
