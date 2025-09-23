import { useQuery } from "@tanstack/react-query";
import { getNewPostData } from "~/services/get-new-post-data";

export function useUserNewPost() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["NEW_POST_DATA"],
    queryFn: getNewPostData,
  });

  return {
    categories: (data?.data?.categories.data || []).map((c) => ({
      ...c,
      label: c.name,
    })),
    postTypes: (data?.data?.postTypes.data || []).map((c) => ({
      ...c,
      label: c.name,
    })),
    isLoading,
    error,
  };
}
