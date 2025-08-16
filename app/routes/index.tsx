import { usePost } from "~/hooks/usePost";
import { Box } from "~/components/ui/box";
import { Text } from "~/components/ui/text";
import { Spinner } from "~/components/ui/spinner";
import { PostImage } from "~/components/ui/post-image";
import { PostAuthor } from "~/components/post-author";
import { Post } from "~/components/post";
import { useIntersectionObserver } from "~/hooks/useIntersectionObserver";
import { useEffect } from "react";
import type { PostAPIProps } from "~/services/get-post";
import { Separator } from "~/components/ui/separator";

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

  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

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
  const userPosts = posts.filter((p) => p.author);
  const adminPosts = posts.filter((p) => p.employee);

  return (
    <Box className="flex-1 p-3 flex-col gap-3">
      <Box className="gap-4 flex-col">
        {adminPosts.map((post) => (
          <Post
            className="border-2 border-green-primary bg-white rounded-4xl"
            key={post.id}
            post={post}
            to={`/post/admin/${post.id}`}
          >
            <Box className="w-full flex-col">
              <Box className="px-5 flex-col pt-2 pb-5 gap-3">
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
                <Separator className="w-full" />
              </Box>
            </Box>
          </Post>
        ))}
        {userPosts.map((post) => (
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
      {/* Trigger element for infinite scroll */}
      <Box ref={ref} className="h-10" />
      {isFetchingNextPage && <Spinner />}
    </Box>
  );
}
