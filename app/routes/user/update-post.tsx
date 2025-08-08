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
  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPost(postId as string),
    enabled: !!postId,
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
        <Text>Ocorreu um erro ao buscar os dados da publicação.</Text>
      </Box>
    );
  }

  const onSave = (data: CreatePostType, files: File[]) => {
    setPost(data, files);
    navigate(`/user/new-post/preview`);
  };

  const initialValues = post
    ? {
        title: post.post.data.title,
        resume: post.post.data.resume,
        description: post.post.data.description,
        categories: post.post.data.categories.map((c) => c.id),
        postTypes: post.post.data.types.map((t) => t.id),
        expiresOn: new Date(post.post.data.expiresOn),
        instagram: post.post.data.social.split(";")[0],
        facebook: post.post.data.social.split(";")[1],
      }
    : {};

  const previews = post
    ? post.post.data.media.map((media) => buildUrl(media.filename))
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
