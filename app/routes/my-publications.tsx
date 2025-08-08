import { Link } from "react-router";
import { Separator } from "~/components/ui/separator";
import type { PostAPIProps } from "~/services/get-post";
import { useQuery } from "@tanstack/react-query";
import { getMyPublications } from "~/services/get-my-publications";
import { Box } from "~/components/ui/box";
import { Text } from "~/components/ui/text";
import { Spinner } from "~/components/ui/spinner";
import { Button } from "~/components/ui/button";
import { PostImage } from "~/components/ui/post-image";
import { usePost } from "~/hooks/usePost";

function Post({ post }: { post: PostAPIProps }) {
  const { deletePostMutation } = usePost();
  const hasImage = post.media.length > 0;

  const onPostDelete = (id: string) => {
    deletePostMutation.mutate(id);
  };

  return (
    <Box className="flex-col py-5 px-5">
      <Box className="w-full flex-col gap-3">
        <Box className="gap-3">
          {hasImage && (
            <PostImage
              className="rounded-lg size-20"
              filename={post.media[0].filename}
              alt={post.title}
            />
          )}
          <Box className="flex-col">
            <Text>{post.title}</Text>
            <Text>Publicado em: {post.createdAt}</Text>
            <Text>Oferta ativa: {post.expiresOn}</Text>
          </Box>
        </Box>
        <Box className="ml-auto items-center">
          <Button variant={"link"}>
            <Link to={`/post/update/${post.id}`}>Editar</Link>
          </Button>
          -
          <Button
            className="cursor-pointer"
            onClick={() => onPostDelete(post.id)}
            variant={"link"}
            disabled={deletePostMutation.isPending}
          >
            {deletePostMutation.isPending ? "Excluindo..." : "Excluir"}
          </Button>
        </Box>
      </Box>
      <Separator className="py-[1px] mt-1.5 bg-gray-300 w-full" />
    </Box>
  );
}

export default function MyPublications() {
  const {
    data: publications,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["my-publications"],
    queryFn: getMyPublications,
  });

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
      <Text variant="title">Minhas publicações</Text>
      <Box className="gap-4 flex-col">
        {publications?.data.map((post: any) => (
          <Post key={post.id} post={post} />
        ))}
      </Box>
    </Box>
  );
}
