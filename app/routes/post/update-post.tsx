import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getPost } from "~/services/get-post";
import { Spinner } from "~/components/ui/spinner";
import { Box } from "~/components/ui/box";
import { Text } from "~/components/ui/text";
import { PostForm } from "./post-form";
import type { CreatePostType } from "~/parsers/create-post";
import { useNewPostStore } from "~/stores/new-post";
import { RouteContainer } from "~/components/route-container";
import { UserPostMapper } from "~/mappers/post";
import { DateFormatter } from "~/utils/date-formatter";

export default function UpdatePost() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { setPost } = useNewPostStore();
  const { data, isLoading, error } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const data = await getPost(postId as string);
      if (!data) throw new Error("data is undefined");
      return UserPostMapper.toDomain(data.post.data);
    },
    enabled: !!postId,
  });

  if (isLoading) {
    return (
      <RouteContainer>
        <Box className="flex flex-1 items-center justify-center h-full">
          <Spinner />
        </Box>
      </RouteContainer>
    );
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

  const onSave = (data: CreatePostType) => {
    setPost(data);
    navigate(`/post/update/${postId}/preview`);
  };

  const initialValues = {
    ...data,
    postTypes: data.types,
    expiresOn: DateFormatter.differenceInMonths(
      new Date(data.expiresOn),
      new Date(data.createdAt)
    ),
  };

  return (
    <RouteContainer>
      <PostForm onSave={onSave} initialValues={initialValues} />
    </RouteContainer>
  );
}
