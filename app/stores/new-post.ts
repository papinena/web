import { create } from "zustand";
import type { CreatePostType } from "~/parsers/create-post";
import type { UpdatePostType } from "~/interfaces/update-post";

type UpdatedPosts = Record<string, UpdatePostType>;

interface NewPostState {
  post?: CreatePostType;
  updatedPosts: UpdatedPosts;
  setPost: (post: CreatePostType) => void;
  updatePost: (postId: string, post: UpdatePostType) => void;
  clear: () => void;
}

export const useNewPostStore = create<NewPostState>((set) => ({
  post: undefined,
  updatedPosts: {},
  setPost: (post) => set({ post }),
  updatePost: (postId, post) =>
    set((state) => ({
      updatedPosts: { ...state.updatedPosts, [postId]: post },
    })),
  clear: () => set({ post: undefined, updatedPosts: {} }),
}));
