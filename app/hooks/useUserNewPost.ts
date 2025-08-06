import { useQuery } from "@tanstack/react-query";
import { getNewPostData } from "~/services/get-new-post-data";

export function useUserNewPost() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["NEW_POST_DATA"],
    queryFn: getNewPostData,
  });

  return {
    categories: data?.data?.categories.data || [],
    postTypes: data?.data?.postTypes.data || [],
    isLoading,
    error,
  };
}
