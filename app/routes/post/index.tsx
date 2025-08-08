import { useQuery } from "@tanstack/react-query";
import "@mdxeditor/editor/style.css";
import { getPost, type PostAPIProps } from "~/services/get-post";
import type { Route } from "../+types";
import { Box } from "~/components/ui/box";
import { useImageReadToken } from "~/hooks/useImageReadToken";
import { ImageGallery } from "~/components/image-gallery";
import { MarkdownEditor } from "~/components/markdown-editor";
import { Text } from "~/components/ui/text";
import { Image } from "~/components/ui/image";
import { PostAuthor } from "~/components/post-author";
import { Separator } from "~/components/ui/separator";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";

function RecommendedPost({ post }: { post: PostAPIProps }) {
  const { buildUrl } = useImageReadToken();
  return (
    <Link to={`/post/${post.id}`}>
      <Box className="w-full flex-col">
        <Box className="px-5 py-10 gap-3">
          <Image src={buildUrl(post.media[0].filename)} />
          <Text>{post.title}</Text>
        </Box>
        <Separator className="py-[1px] bg-gray-300 w-full" />
      </Box>
    </Link>
  );
}

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
        <Text>{fb}</Text>
      </Box>
    </Box>
  );
}

export default function Post({ params }: Route.ComponentProps) {
  const { postId } = params;
  const { buildUrl } = useImageReadToken();

  const { data, isLoading, error } = useQuery({
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

  const post = data?.post.data;
  const hasMedia = post?.media && post.media.length > 0;
  const author = post?.author;
  const recommendedPosts = data?.recommendedPosts;

  return (
    <Box className="flex-1 flex-col gap-5">
      <Box className="p-3 flex-1 bg-white rounded-lg flex-col gap-4">
        {hasMedia && <ImageGallery media={post.media} buildUrl={buildUrl} />}
        {post?.description && (
          <MarkdownEditor markdown={post.description} readOnly />
        )}
        <Text className="font-bold">
          Se interessou? Entre em contato direto com o seu vizinho.
        </Text>
        <Box className="flex-col">
          <PostAuthor author={author} />
          <PostNetworks social={post?.social} />
          <Box className="flex items-center gap-1.5">
            <Image src="/wpp-icon.svg" className="size-5" />
            <Text>{author?.telephone}</Text>
          </Box>
        </Box>
      </Box>
      <Box className="flex-col p-3 bg-white rounded-lg gap-5">
        <Box className="flex-col">
          {recommendedPosts?.data.map((r) => (
            <RecommendedPost post={r} />
          ))}
        </Box>
        <Button asChild variant={"link"} className="ml-auto underline">
          <Link to="#">Veja mais publicações relacionadas</Link>
        </Button>
      </Box>
    </Box>
  );
}
