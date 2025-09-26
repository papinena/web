import { useNavigate } from "react-router";
import { AdminPostForm } from "~/components/post/admin-post-form";
import { RouteContainer } from "~/components/route-container";
import type { Route } from "../+types";
import { useAdminPost } from "~/hooks/useAdminPost";
import { Loading } from "~/components/loading";
import type { UpdateAdminPostType } from "~/parsers/update-admin-post";
import { useAdminNewPostStore } from "~/stores/admin-new-post";
import { useImageReadToken } from "~/hooks/useImageReadToken";
import { useQuery } from "@tanstack/react-query";
import { createFileFromUrl } from "~/utils/create-file-from-url";

export default function UpdateAdminPost({ params }: Route.ComponentProps) {
  const navigate = useNavigate();

  const { postId } = params;
  const { useGetAdminPost } = useAdminPost();
  const { data, isLoading } = useGetAdminPost({ id: postId });
  const { updatedPosts, updatePost } = useAdminNewPostStore();
  const { buildUrl } = useImageReadToken();

  const imageUrls = data?.post.photos?.map((m) => buildUrl(m.filename)) ?? [];

  const { data: initialPhotos, isLoading: isLoadingFiles } = useQuery({
    queryKey: ["post-images", postId],
    queryFn: () => Promise.all(imageUrls.map((url) => createFileFromUrl(url))),
    enabled: !!imageUrls.length,
  });

  const onSave = (data: UpdateAdminPostType) => {
    updatePost(postId, data);
    navigate(`/post/admin/preview/${postId}`);
  };

  const initialValues = updatedPosts[postId]
    ? updatedPosts[postId]
    : {
        ...data?.post,
        photos: initialPhotos,
      };

  if (isLoading || isLoadingFiles) {
    return <Loading />;
  }

  return (
    <RouteContainer>
      <AdminPostForm onSave={onSave} initialValues={initialValues} />
    </RouteContainer>
  );
}
