import { useInfiniteQuery } from "@tanstack/react-query";
import { getCondominiumPosts } from "~/services/get-condominium-posts";

export const useCondominiumPosts = () => {
  return useInfiniteQuery({
    queryKey: ["condominium-posts"],
    queryFn: ({ pageParam = 1 }) => getCondominiumPosts({ page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      // If the last page has no data, there are no more pages
      if (lastPage.data.length === 0) {
        return undefined;
      }
      // Otherwise, increment the page number
      return allPages.length + 1;
    },
    initialPageParam: 1,
  });
};
