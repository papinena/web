import { create } from "zustand";
import type { CreateAdminPostType } from "~/parsers/create-admin-post";

interface AdminNewPostState {
  post?: CreateAdminPostType;
  files: File[];
  setPost: (post: CreateAdminPostType) => void;
  clear: () => void;
}

export const useAdminNewPostStore = create<AdminNewPostState>((set) => ({
  post: undefined,
  files: [],
  setPost: (post) => set({ post }),
  clear: () => set({ post: undefined, files: [] }),
}));
