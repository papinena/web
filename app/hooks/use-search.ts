import { useMutation } from "@tanstack/react-query";
import { searchPosts } from "~/services/search-posts";

export function useSearch() {
  const searchMutation = useMutation({
    mutationFn: async (term: string) => {
      const data = await searchPosts(term);

      return data;
    },
  });

  return { searchMutation };
}
