import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getPost } from "~/services/get-post";
import { Spinner } from "~/components/ui/spinner";
import { Box } from "~/components/ui/box";
import { Text } from "~/components/ui/text";
import { PostForm } from "./post-form";
import { usePost } from "~/hooks/usePost";
import type { CreatePostType } from "~/parsers/create-post";
import { useNewPostStore } from "~/stores/new-post";
import { useImageReadToken } from "~/hooks/useImageReadToken";

export default function UpdatePost() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { setPost } = useNewPostStore();
  const { updatePostMutation } = usePost();
  const { buildUrl } = useImageReadToken();
  const { data, isLoading, error } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPost(postId as string),
    enabled: !!postId,
  });
  const post = data?.post;

  if (isLoading) {
    return (
      <Box className="flex flex-1 items-center justify-center h-full">
        <Spinner />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex items-center justify-center h-full">
        <Text>Ocorreu um erro ao buscar os dados da publicação.</Text>
      </Box>
    );
  }

  if (!post) {
    return (
      <Box className="flex items-center justify-center h-full">
        <Text>Dados do post não foram encontrados</Text>
      </Box>
    );
  }

  const onSave = (data: CreatePostType, files: File[]) => {
    setPost(data, files);
    navigate(`/post/update/${postId}/preview`);
  };

  const initialValues = {
    title: post.data.title ?? "",
    resume: post.data.resume,
    description: post.data.description ?? "",
    categories: post.data.categories.map((c) => c.id),
    postTypes: post.data.types.map((t) => t.id),
    expiresOn: new Date(post.data.expiresOn),
    instagram: post.data.social.split(";")[0],
    facebook: post.data.social.split(";")[1],
  };

  const previews = post
    ? post.data.media.map((media) => buildUrl(media.filename))
    : [];

  return (
    <PostForm
      onSave={onSave}
      initialValues={initialValues}
      isLoading={updatePostMutation.isPending}
      previews={previews}
    />
  );
}
