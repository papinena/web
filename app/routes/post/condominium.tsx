import { useEffect } from "react";
import { Post } from "~/components/post";
import { RouteContainer } from "~/components/route-container";
import { Box } from "~/components/ui/box";
import { PostImage } from "~/components/ui/post-image";
import { Spinner } from "~/components/ui/spinner";
import { Text } from "~/components/ui/text";
import { useCondominiumPosts } from "~/hooks/use-condominium-posts";
import { useIntersectionObserver } from "~/hooks/useIntersectionObserver";

export default function CondominiumPost() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useCondominiumPosts();
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === "pending") {
    return <Spinner />;
  }

  if (status === "error") {
    return <span>Error: {error.message}</span>;
  }

  const posts = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <RouteContainer className="bg-green-primary">
      <Box className="rounded-xl flex-col bg-white p-3">
        <Text className="text-2xl font-bold">Mural do condomínio</Text>
        <Text>Fique por dentro do que acontece no seu condomínio</Text>
      </Box>
      <Box className="flex-col gap-3">
        {posts.map((post) => (
          <Post
            ref={ref}
            className="border-2 py-3 border-green-primary bg-white rounded-4xl"
            key={post.id}
            post={post}
            to={`/post/admin/${post.id}`}
          >
            <Box className="w-full flex-col">
              <Box className="px-5 flex-col pt-2 pb-1.5 gap-3">
                <Post.CreatedAt format="Pp" post={post} />
                <Box className="gap-3">
                  {post.media.length > 0 && (
                    <PostImage
                      className="rounded-lg size-32"
                      filename={post.media[0].filename}
                      alt={post.title}
                    />
                  )}
                  <Box className="flex-col">
                    <Post.Title className="text-green-primary" post={post} />
                    <Post.Resume post={post} />
                  </Box>
                </Box>
                <Text className="text-sm text-gray-400">
                  {`Postado por: ${post.employee?.name} (${post.employee?.position})`}
                </Text>
              </Box>
            </Box>
          </Post>
        ))}

        {/* Trigger element for infinite scroll */}
        {isFetchingNextPage && <Spinner className="mx-auto" />}
      </Box>
    </RouteContainer>
  );
}
