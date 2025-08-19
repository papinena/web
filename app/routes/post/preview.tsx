import { Box } from "~/components/ui/box";
import { headingsPlugin, listsPlugin, MDXEditor } from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { ImageGallery } from "~/components/image-gallery";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useNavigate } from "react-router";
import { ButtonWithSpinner } from "~/components/button-with-spinner";
import { ErrorMessage } from "~/components/error-message";
import { useNewPostStore } from "~/stores/new-post";
import { usePost } from "~/hooks/usePost"; // Assuming you extract the hook
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useAuth } from "~/hooks/useAuth";
import { useImageReadToken } from "~/hooks/useImageReadToken";
import { Image } from "~/components/ui/image";
import { RouteContainer } from "~/components/route-container";

function PostNetworks({ social }: { social?: string }) {
  if (!social) return null;
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

export default function NewPostPreview() {
  const navigate = useNavigate();
  const { post, files, clear } = useNewPostStore();
  const { authData } = useAuth();
  const { buildUrl } = useImageReadToken();

  const { createPostMutation } = usePost();

  if (!post) {
    return <RouteContainer>No post data found.</RouteContainer>;
  }

  const onPublish = () => {
    createPostMutation.mutate(
      { form: post, files },
      {
        onSuccess: (postId) => {
          clear();
          navigate(`/post/${postId}`);
        },
      }
    );
  };

  const media = files.map((file) => ({
    id: file.name,
    filename: URL.createObjectURL(file),
    type: "IMAGE" as const,
  }));

  const author =
    authData?.userType === "user" ? authData.user : authData?.employee;

  return (
    <RouteContainer>
      <Box className="p-3 flex-1 bg-white rounded-lg flex-col gap-4">
        <ImageGallery media={media} buildUrl={(filename) => filename} />
        {post.description && (
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
              aria-label={author?.name || author?.email || "Avatar"}
            >
              <AvatarImage src={buildUrl(author?.avatar ?? "")} />
              <AvatarFallback>
                {author?.name?.[0] || author?.email?.[0]}
              </AvatarFallback>
            </Avatar>
            <Box className="flex-col">
              <Text>{author?.name}</Text>
              <Text>Bloco: {author?.block}</Text>
            </Box>
          </Box>
          <PostNetworks social={`${post.instagram};${post.facebook}`} />
          <Box className="flex items-center gap-1.5">
            <Image src="/wpp-icon.svg" className="size-5" />
            <Text>{author?.telephone}</Text>
          </Box>
        </Box>
        <Box className="flex gap-10 w-full">
          <Button
            className="bg-blue-primary flex-1 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            Editar
          </Button>
          <ButtonWithSpinner
            className="mx-0 hover:bg-black/90 flex-1 bg-blue-primary"
            loading={createPostMutation.isPending}
            onClick={onPublish}
          >
            Publicar
          </ButtonWithSpinner>
        </Box>
        <ErrorMessage show={createPostMutation.isError}>
          {(createPostMutation.error as Error)?.message}
        </ErrorMessage>
      </Box>
    </RouteContainer>
  );
}
