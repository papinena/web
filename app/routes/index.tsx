import { usePost } from "~/hooks/usePost";
import { Box } from "~/components/ui/box";
import { Text } from "~/components/ui/text";
import { Spinner } from "~/components/ui/spinner";
import { PostImage } from "~/components/ui/post-image";
import { PostAuthor } from "~/components/post-author";
import { Post } from "~/components/post";
import { Button } from "~/components/ui/button";
import type { PostAPIProps } from "~/services/get-post";

export default function Home() {
  const { useListPosts } = usePost();
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useListPosts();

  if (isLoading) {
    return (
      <Box className="flex flex-1 items-center justify-center h-full">
        <Spinner />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex flex-1 items-center justify-center h-full">
        <Text>Ocorreu um erro ao buscar as publicações.</Text>
      </Box>
    );
  }

  const pages = data?.pages.flatMap((page) => page) ?? [];
  const posts = pages.flatMap((p) => p.userPosts.data);

  return (
    <Box className="flex-1 p-3 flex-col gap-3">
      <Box className="gap-4 flex-col">
        {posts.map((post: PostAPIProps) => (
          <Post className="bg-white rounded-4xl" key={post.id} post={post}>
            <Box className="w-full flex-col">
              <Box className="px-5 py-10 gap-3">
                {post.media.length > 0 && (
                  <PostImage
                    className="rounded-lg size-32"
                    filename={post.media[0].filename}
                    alt={post.title}
                  />
                )}
                <Box className="flex-col">
                  <PostAuthor className="items-start">
                    <PostAuthor.Avatar
                      style={{ width: 50, height: 50 }}
                      className="!rounded-lg"
                      fallbackProps={{
                        className: "!rounded-lg",
                      }}
                      author={post.author}
                    />
                    <Box className="flex-col">
                      <Box className="flex-col">
                        <PostAuthor.Name author={post.author} />
                        <PostAuthor.Block author={post.author} />
                      </Box>
                    </Box>
                  </PostAuthor>
                  <Post.CreatedAt post={post} />
                  <Post.Title post={post} />
                  <Post.Resume post={post} />
                  <Text>Contato: {post.author.telephone}</Text>
                  <Post.Networks post={post} />
                </Box>
              </Box>
            </Box>
          </Post>
        ))}
      </Box>
      {hasNextPage && (
        <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? "Carregando..." : "Carregar mais"}
        </Button>
      )}
    </Box>
  );
}
