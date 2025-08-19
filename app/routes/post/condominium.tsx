import { Post } from "~/components/post";
import { Box } from "~/components/ui/box";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { Text } from "~/components/ui/text";
import { useCondominiumPosts } from "~/hooks/use-condominium-posts";

export default function CondominiumPost() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useCondominiumPosts();

  if (status === "pending") {
    return <Spinner />;
  }

  if (status === "error") {
    return <span>Error: {error.message}</span>;
  }

  const posts = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <Box className="flex-col bg-green-primary absolute">
      <Box className="rounded-xl flex-col bg-white p-3">
        <Text className="text-2xl font-bold">Mural do condomínio</Text>
        <Text>Fique por dentro do que acontece no seu condomínio</Text>
      </Box>
      {posts.map((post) => (
        <Post key={post.id} post={post}>
          <Post.Title post={post} />
          <Post.Resume post={post} />
          <Post.CreatedAt post={post} />
        </Post>
      ))}
      <div>
        <Button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
            ? "Load More"
            : "Nothing more to load"}
        </Button>
      </div>
    </Box>
  );
}
