import { type ClientLoaderFunctionArgs } from "react-router";
import { searchPosts } from "~/services/search-posts";
import type { UserPostAPIProps } from "~/interfaces/post";
import { Box } from "~/components/ui/box";
import { Post } from "~/components/post";
import { PostImage } from "~/components/ui/post-image";
import { PostAuthor } from "~/components/post-author";
import { Text } from "~/components/ui/text";
import { RouteContainer } from "~/components/route-container";

export async function clientLoader({ request }: ClientLoaderFunctionArgs) {
  const searchParams = new URL(request.url).searchParams;
  const term = searchParams.get("term");

  if (term) {
    const data = await searchPosts(term);

    return { posts: data, term };
  }
  return { posts: null, term };
}

export default function Search({
  loaderData,
}: {
  loaderData: { term: string; posts: UserPostAPIProps[] | null };
}) {
  const posts = loaderData?.posts;
  const term = loaderData.term;

  return (
    <RouteContainer className="bg-blue-primary">
      <Box className="bg-white p-4 items-center justify-center rounded-4xl">
        <Text>
          Você buscou por: <strong>{term}</strong>
        </Text>
      </Box>
      {posts?.map((post) => (
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
                <Text>Contato: {post.author?.telephone}</Text>
                <Post.Networks post={post} />
              </Box>
            </Box>
          </Box>
        </Post>
      ))}
    </RouteContainer>
  );
}
