import { useMutation } from "@tanstack/react-query";
import { searchPosts } from "~/services/search-posts";

export const useSearchPosts = () => {
  return useMutation({
    mutationFn: (term: string) => searchPosts(term),
  });
};
