import { create } from "zustand";
import type { CreatePostType } from "~/parsers/create-post";

interface NewPostState {
  post?: CreatePostType;
  setPost: (post: CreatePostType) => void;
  clear: () => void;
}

export const useNewPostStore = create<NewPostState>((set) => ({
  post: undefined,
  files: [],
  setPost: (post) => set({ post }),
  clear: () => set({ post: undefined }),
}));
