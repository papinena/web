import { create } from "zustand";
import type { CreatePostType } from "~/parsers/create-post";

interface NewPostState {
  post?: CreatePostType;
  files: File[];
  setPost: (post: CreatePostType, files: File[]) => void;
  clear: () => void;
}

export const useNewPostStore = create<NewPostState>((set) => ({
  post: undefined,
  files: [],
  setPost: (post, files) => set({ post, files }),
  clear: () => set({ post: undefined, files: [] }),
}));
