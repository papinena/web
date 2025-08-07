import { useQuery } from "@tanstack/react-query";
import "@mdxeditor/editor/style.css";
import { getPost } from "~/services/get-post";
import type { Route } from "../+types";
import { Box } from "~/components/ui/box";
import { useImageReadToken } from "~/hooks/useImageReadToken";
import { ImageGallery } from "~/components/image-gallery";
import { headingsPlugin, listsPlugin, MDXEditor } from "@mdxeditor/editor";
import { Text } from "~/components/ui/text";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Image } from "~/components/ui/image";

function PostNetworks({ social }: { social?: string }) {
  if (!social) return;
  const [ig, fb] = social.split(";");
  return (
    <Box className="flex-col">
      <Box className="flex items-center gap-1.5">
        <Image src="/instagram.svg" className="size-5" />
        <Text>{ig}</Text>
      </Box>
      <Box className="flex items-center gap-1.5">
        <Image src="/facebook.svg" className="size-5" />
        <Text>{ig}</Text>
      </Box>
    </Box>
  );
}

export default function Post({ params }: Route.ComponentProps) {
  const { postId } = params;
  const { buildUrl } = useImageReadToken();

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPost(postId),
    enabled: !!postId,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const hasMedia = post?.media && post.media.length > 0;
  const author = post?.author;

  return (
    <Box className="p-3 flex-1 bg-white rounded-lg flex-col gap-4">
      {hasMedia && <ImageGallery media={post.media} buildUrl={buildUrl} />}
      {post?.description && (
        <MDXEditor
          plugins={[headingsPlugin(), listsPlugin()]}
          markdown={post.description}
          readOnly
          contentEditableClassName="prose"
        />
      )}
      <Text className="font-bold">
        Se interessou? Entre em contato direto com o seu vizinho.
      </Text>
      <Box className="flex-col">
        <Box className="gap-2 items-center">
          <Avatar
            className=""
            style={{ width: 40, height: 40 }}
            aria-label={author?.name || author?.name || "Avatar"}
          >
            <AvatarImage src={buildUrl(author?.avatar ?? "")} />
            <AvatarFallback>{author?.name[0]}</AvatarFallback>
          </Avatar>
          <Box className="flex-col">
            <Text>{author?.name}</Text>
            <Text>Bloco: {author?.block}</Text>
          </Box>
        </Box>
        <PostNetworks social={post?.social} />
        <Box className="flex items-center gap-1.5">
          <Image src="/wpp-icon.svg" className="size-5" />
          <Text>{author?.telephone}</Text>
        </Box>
      </Box>
    </Box>
  );
}
