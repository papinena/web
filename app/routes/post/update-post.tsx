import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getPost } from "~/services/get-post";
import { Box } from "~/components/ui/box";
import { Text } from "~/components/ui/text";
import { PostForm } from "./post-form";
import type { CreatePostType } from "~/parsers/create-post";
import { useNewPostStore } from "~/stores/new-post";
import { RouteContainer } from "~/components/route-container";
import { UserPostMapper } from "~/mappers/post";
import { DateFormatter } from "~/utils/date-formatter";
import { useImageReadToken } from "~/hooks/useImageReadToken";
import { createFileFromUrl } from "~/utils/create-file-from-url";
import { Loading } from "~/components/loading";

export default function UpdatePost() {
  const { postId } = useParams() as { postId: string };
  const navigate = useNavigate();
  const { updatePost, updatedPosts } = useNewPostStore();
  const { buildUrl } = useImageReadToken();

  const { data, isLoading, error } = useQuery({
    queryKey: ["update-user-post", postId],
    queryFn: async () => {
      const data = await getPost(postId as string);
      if (!data) throw new Error("data is undefined");
      return UserPostMapper.toDomain(data.post.data);
    },
  });

  const imageUrls = data?.media?.map((m) => buildUrl(m.filename)) ?? [];

  const { data: initialPhotos, isLoading: isLoadingFiles } = useQuery({
    queryKey: ["update-user-post-images", postId],
    queryFn: () => Promise.all(imageUrls.map((url) => createFileFromUrl(url))),
    enabled: !!imageUrls.length,
  });

  if (isLoading || isLoadingFiles) {
    return <Loading />;
  }

  if (error) {
    return (
      <RouteContainer>
        <Box className="flex items-center justify-center h-full">
          <Text>Ocorreu um erro ao buscar os dados da publicação.</Text>
        </Box>
      </RouteContainer>
    );
  }

  if (!data) {
    return (
      <RouteContainer>
        <Box className="flex items-center justify-center h-full">
          <Text>Dados do post não foram encontrados</Text>
        </Box>
      </RouteContainer>
    );
  }

  const onSave = (formData: CreatePostType) => {
    if (!postId || !data) return;
    updatePost(postId, { ...formData, createdAt: data.createdAt });
    navigate(`/post/update/${postId}/preview`);
  };

  const expiresOn =
    new Date(data.expiresOn).getFullYear() === 9999
      ? 9999
      : DateFormatter.differenceInMonths(
          new Date(data.expiresOn),
          new Date(data.createdAt)
        );

  const initialValues = updatedPosts[postId]
    ? {
        ...updatedPosts[postId as string],
      }
    : {
        ...data,
        postTypes: data.types,
        expiresOn,
        files: initialPhotos,
        instagram: data.social?.split(";")[0],
        facebook: data.social?.split(";")[1],
      };

  return (
    <RouteContainer>
      <PostForm onSave={onSave} initialValues={initialValues} />
    </RouteContainer>
  );
}
