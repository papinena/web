import { create } from "zustand";
import type { CreateAdminPostType } from "~/parsers/create-admin-post";
import type { UpdateAdminPostType } from "~/parsers/update-admin-post";

interface AdminNewPostState {
  post?: CreateAdminPostType;
  files: File[];
  setPost: (post: CreateAdminPostType) => void;
  clear: () => void;
  updatedPosts: Record<string, UpdateAdminPostType>;
  updatePost: (id: string, post: UpdateAdminPostType) => void;
  clearUpdatedPost: (id: string) => void;
}

export const useAdminNewPostStore = create<AdminNewPostState>((set) => ({
  post: undefined,
  files: [],
  setPost: (post) => set({ post }),
  clear: () => set({ post: undefined, files: [] }),
  updatedPosts: {},
  updatePost: (id, post) =>
    set((state) => ({
      updatedPosts: {
        ...state.updatedPosts,
        [id]: post,
      },
    })),
  clearUpdatedPost: (id) =>
    set((state) => {
      const newUpdatedPosts = { ...state.updatedPosts };
      delete newUpdatedPosts[id];
      return { updatedPosts: newUpdatedPosts };
    }),
}));
