
import { create } from 'zustand';
import type { CreatePostType } from '~/parsers/create-post';

interface NewPostState {
  post: CreatePostType | null;
  files: File[];
  setPost: (post: CreatePostType, files: File[]) => void;
  clear: () => void;
}

export const useNewPostStore = create<NewPostState>((set) => ({
  post: null,
  files: [],
  setPost: (post, files) => set({ post, files }),
  clear: () => set({ post: null, files: [] }),
}));
