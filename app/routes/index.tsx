import { usePost } from "~/hooks/usePost";
import { Box } from "~/components/ui/box";
import { Text } from "~/components/ui/text";
import { Spinner } from "~/components/ui/spinner";
import { PostImage } from "~/components/ui/post-image";
import type { PostAPIProps } from "~/services/get-post";
import { Link } from "react-router";
import { Separator } from "~/components/ui/separator";

function Post({ post }: { post: PostAPIProps }) {
  const hasImage = post.media.length > 0;

  return (
    <Link to={`/post/${post.id}`}>
      <Box className="w-full flex-col">
        <Box className="px-5 py-10 gap-3">
          {hasImage && (
            <PostImage
              className="rounded-lg size-20"
              filename={post.media[0].filename}
              alt={post.title}
            />
          )}
          <Text>{post.title}</Text>
        </Box>
        <Separator className="py-[1px] bg-gray-300 w-full" />
      </Box>
    </Link>
  );
}

export default function Home() {
  const { useListPosts } = usePost();
  const { data: posts, isLoading, error } = useListPosts();

  if (isLoading) {
    return (
      <Box className="flex items-center justify-center h-full">
        <Spinner />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex items-center justify-center h-full">
        <Text>Ocorreu um erro ao buscar as publicações.</Text>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-white rounded-lg p-3 flex-col gap-3">
      <Text variant="title">Publicações</Text>
      <Box className="gap-4 flex-col">
        {posts?.userPosts.data?.map((post: any) => (
          <Post key={post.id} post={post} />
        ))}
      </Box>
    </Box>
  );
}
