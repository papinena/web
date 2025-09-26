import { useQuery } from "@tanstack/react-query";
import "@mdxeditor/editor/style.css";
import { getPost } from "~/services/get-post";
import type { UserPostAPIProps } from "~/interfaces/post";
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
import { PostImage } from "~/components/ui/post-image";
import { RouteContainer } from "~/components/route-container";
import { formatPostNetworks } from "~/utils/get-user-networks";

function RecommendedPost({ post }: { post: UserPostAPIProps }) {
  const photo = post.media[0]?.filename;
  return (
    <Link to={`/post/${post.id}`}>
      <Box className="w-full flex-col">
        <Box className="px-3 py-6 gap-3">
          {photo && (
            <PostImage
              className="size-20"
              alt={"first photo"}
              filename={photo}
            />
          )}
          <Text>{post.title}</Text>
        </Box>
        <Separator className="py-[1px] bg-gray-300 w-full" />
      </Box>
    </Link>
  );
}

function PostNetworks({ social }: { social?: string }) {
  if (!social) return;
  if (social === ";") return;
  const [ig, fb] = formatPostNetworks(social);

  return (
    <Box className="flex-col">
      {ig && (
        <Box className="flex items-center gap-1.5">
          <Image src="/instagram.svg" className="size-5" />
          <Button
            className="justify-start h-auto align-start p-0 m-0"
            variant={"link"}
            asChild
            onClick={(e) => e.stopPropagation()}
          >
            <a className="!text-base" href={ig.url}>
              {ig.social}/{ig.label}
            </a>
          </Button>
        </Box>
      )}
      {fb && (
        <Box className="flex items-center gap-1.5">
          <Image src="/facebook.svg" className="size-5" />
          <Button
            className="justify-start h-auto align-start p-0 m-0"
            variant={"link"}
            asChild
            onClick={(e) => e.stopPropagation()}
          >
            <a className="!text-base" href={fb.url}>
              {fb.social}/{fb.label}
            </a>
          </Button>
        </Box>
      )}
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
    return <RouteContainer>Loading...</RouteContainer>;
  }

  if (error) {
    return <RouteContainer>Error: {error.message}</RouteContainer>;
  }

  const post = data?.post.data;
  const hasMedia = post?.media && post.media.length > 0;
  const author = post?.author;
  const recommendedPosts = data?.recommendedPosts;
  const includeTelephone = post?.includeTelephone;

  return (
    <RouteContainer>
      <Box className="flex-1 flex-col gap-5">
        <Box className="p-3 flex-1 bg-white rounded-lg flex-col gap-4">
          {hasMedia && <ImageGallery media={post.media} buildUrl={buildUrl} />}
          {post?.title && (
            <Text variant="title" color="user" className="font-bold">
              {post.title}
            </Text>
          )}
          {post?.resume && <Text>{post.resume}</Text>}
          {post?.description && (
            <MarkdownEditor
              contentEditableClassName="!p-0"
              markdown={post.description}
              readOnly
            />
          )}
          <Text className="font-bold">
            Se interessou? Entre em contato direto com o seu vizinho.
          </Text>
          <Box className="flex-col">
            <PostAuthor>
              <PostAuthor.Avatar author={author} />
              <Box className="flex-col">
                <PostAuthor.Name author={author} />
                <PostAuthor.Block author={{ block: author?.block }} />
              </Box>
            </PostAuthor>
            <PostNetworks social={post?.social} />
            {includeTelephone && (
              <Box className="flex items-center gap-1.5">
                <Image src="/wpp-icon.svg" className="size-5" />
                <Text>{author?.telephone}</Text>
              </Box>
            )}
          </Box>
        </Box>
        {recommendedPosts && recommendedPosts.data.length > 0 && (
          <Box className="flex-col p-3 bg-white rounded-lg gap-1.5">
            <Text variant="title">Publicações Relacionadas</Text>
            <Box className="flex-col">
              {recommendedPosts?.data.map((r) => (
                <RecommendedPost post={r} />
              ))}
            </Box>
            <Button asChild variant={"link"} className="ml-auto underline">
              <Link to="#">Veja mais publicações relacionadas</Link>
            </Button>
          </Box>
        )}
      </Box>
    </RouteContainer>
  );
}
