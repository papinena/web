import { useQuery } from "@tanstack/react-query";
import "@mdxeditor/editor/style.css";
import { getPost } from "~/services/get-post";
import type { Route } from "../+types";
import { Box } from "~/components/ui/box";
import { useImageReadToken } from "~/hooks/useImageReadToken";
import { ImageGallery } from "~/components/image-gallery";
import { MarkdownEditor } from "~/components/markdown-editor";
import { Text } from "~/components/ui/text";
import { Image } from "~/components/ui/image";
import { RouteContainer } from "~/components/route-container";

export default function Post({ params }: Route.ComponentProps) {
  const { postId } = params;
  const { buildUrl } = useImageReadToken();

  const { data, isLoading, error } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPost(postId),
    enabled: !!postId,
  });

  if (isLoading) {
    return <RouteContainer>Loading...</RouteContainer>;
  }

  if (error) {
    return <RouteContainer>Error: {error.message}</RouteContainer>;
  }

  const post = data?.post.data;
  const hasMedia = post?.media && post.media.length > 0;

  return (
    <RouteContainer>
      <Box className="flex-1 flex-col gap-5">
        <Box className="p-3 flex-1 bg-white rounded-lg flex-col gap-4">
          {hasMedia && <ImageGallery media={post.media} buildUrl={buildUrl} />}
          <Text className="text-green-primary font-bold">{post?.resume}</Text>
          {post?.description && (
            <MarkdownEditor markdown={post.description} readOnly />
          )}
        </Box>
      </Box>
    </RouteContainer>
  );
}
